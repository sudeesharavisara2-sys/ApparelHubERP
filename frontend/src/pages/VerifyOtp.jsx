import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp, resendRegisterOtp } from "../services/authService"; // ඔබේ resend සර්විස් එක මෙතනට ඇතුළත් කරන්න
import Logo from "../components/Logo"; 
import "./AuthCommon.css";

function VerifyOtp() {
    const navigate = useNavigate();
    const [otpCode, setOtpCode] = useState("");
    const [message, setMessage] = useState("");
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes = 300 seconds
    const email = localStorage.getItem("verifyEmail");

    // Countdown Timer Logic
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        if (timeLeft === 0) {
            setMessage("OTP expired. Please resend.");
            return;
        }
        try {
            await verifyOtp({ email, otpCode });
            localStorage.removeItem("verifyEmail");
            navigate("/login");
        } catch {
            setMessage("Invalid or expired OTP.");
        }
    };

    const handleResend = async () => {
        try {
            await resendRegisterOtp({ email }); 
            setTimeLeft(300); // Timer එක නැවත 5 min වලට reset කිරීම
            setMessage("A new OTP has been sent to your email.");
        } catch {
            setMessage("Failed to resend OTP. Try again later.");
        }
    };

    return (
        <div className="auth-page" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
            <form className="auth-card" onSubmit={handleVerify} style={{ width: "100%", maxWidth: "550px", padding: "30px", background: "white", borderRadius: "40px", boxShadow: "10px 20px 20px rgba(0,0,0,0.1)" }}>
                
                {/* Logo and Divider Section */}
                <div style={{ textAlign: "center", marginBottom: "30px", width: "100%" }}>
                    <Logo />
                    <hr style={{ border: "0", borderTop: "2px solid #e2e8f0", marginTop: "15px", width: "80px", marginInline: "auto" }} />
                </div>
                
                {/* Heading Section */}
                <h2 style={{ textAlign: "left", fontSize: "24px", marginBottom: "15px" }}>Verify Email</h2>
                
                
                
                <p style={{ textAlign: "center", color: "#64748b", marginBottom: "20px", fontSize: "14px" }}>
                    Enter the OTP sent to <br/> <strong>{email}</strong>
                </p>

                {message && <div style={{ marginBottom: "15px", color: message.includes("sent") ? "green" : "red", textAlign: "center", fontSize: "13px" }}>{message}</div>}

                {/* Email (Disabled input) */}
                <input 
                    value={email || ""} 
                    disabled 
                    style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #e2e8f0", textAlign: "center", background: "#f8fafc", cursor: "not-allowed" }} 
                />

                {/* OTP Input */}
                <input
                    placeholder="000000"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    maxLength="6"
                    required
                    style={{ 
                        width: "100%", padding: "12px", marginBottom: "20px", borderRadius: "8px", 
                        border: "1px solid #cbd5e1", textAlign: "center", fontSize: "20px", letterSpacing: "8px" 
                    }}
                />

                {/* Timer Display */}
                <div style={{ textAlign: "center", marginBottom: "15px", fontSize: "16px", fontWeight: "bold", color: timeLeft < 60 ? "red" : "#64748b" }}>
                    {timeLeft > 0 ? `Expires in: ${formatTime(timeLeft)}` : "OTP Expired"}
                </div>
                

                <button type="submit" className="btn primary full" style={{ width: "100%", padding: "12px", cursor: "pointer", borderRadius: "8px" }} disabled={timeLeft === 0}>
                    {timeLeft === 0 ? "Expired" : "Verify OTP"}
                </button>

                {/* Resend OTP Section */}
                <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px" }}>
                    Didn't receive the code? 
                    <button type="button" onClick={handleResend} style={{ background: "none", border: "none", color: "#2563eb", fontWeight: "bold", cursor: "pointer", marginLeft: "5px" }}>
                        Resend OTP
                    </button>
                </p>
            </form>
        </div>
    );
}

export default VerifyOtp;
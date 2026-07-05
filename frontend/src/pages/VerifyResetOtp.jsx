import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyResetOtp, forgotPassword } from "../services/authService";
import Logo from "../components/Logo"; 
import "./AuthCommon.css";

function VerifyResetOtp() {
    const navigate = useNavigate();
    const [otpCode, setOtpCode] = useState("");
    const [message, setMessage] = useState("");
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes = 300 seconds
    const email = localStorage.getItem("resetEmail");

    // Countdown Timer Logic
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Format seconds to mm:ss
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
            await verifyResetOtp({ email, otpCode });
            navigate("/reset-password");
        } catch {
            setMessage("Invalid or expired reset OTP.");
        }
    };

    const handleResend = async () => {
        try {
            await forgotPassword({ email });
            setTimeLeft(300); // Reset timer to 5 minutes
            setMessage("A new OTP has been sent to your email.");
        } catch {
            setMessage("Failed to resend OTP. Try again later.");
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleVerify}>
                <div style={{ textAlign: "center", marginBottom: "25px" }}>
                    <Logo />
                    <hr style={{ border: "0", borderTop: "1px solid #e2e8f0", marginTop: "15px", width: "60px", marginInline: "auto" }} />
                </div>
                
                <h2 style={{ textAlign: "left", fontSize: "24px", marginBottom: "15px" , }}>Verify OTP</h2>
                
                

                <p style={{ textAlign: "center", color: "#64748b", marginBottom: "20px", fontSize: "14px" }}>
                    Enter the 6-digit code sent to <br/> <strong>{email}</strong>
                </p>

                {message && <div style={{ marginBottom: "15px", color: message.includes("sent") ? "green" : "red", textAlign: "center", fontSize: "13px" }}>{message}</div>}

                <input
                    placeholder="000000"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    maxLength="6"
                    required
                    style={{ 
                        width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", 
                        border: "1px solid #ccc", textAlign: "center", fontSize: "20px", letterSpacing: "8px" 
                    }}
                />
{/* Timer Display */}
                <div style={{ textAlign: "center", marginBottom: "15px", fontSize: "16px", fontWeight: "bold", color: timeLeft < 60 ? "red" : "#64748b" }}>
                    {timeLeft > 0 ? `Expires in: ${formatTime(timeLeft)}` : "OTP Expired"}
                </div>
                <button type="submit" className="btn primary full" style={{ padding: "12px", cursor: "pointer" }} disabled={timeLeft === 0}>
                    {timeLeft === 0 ? "Expired" : "Verify OTP"}
                </button>

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

export default VerifyResetOtp;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp } from "../services/authService";

function VerifyOtp() {
    const navigate = useNavigate();

    const [otpCode, setOtpCode] = useState("");
    const [message, setMessage] = useState("");

    const email = localStorage.getItem("verifyEmail");

    const handleVerify = async (e) => {
        e.preventDefault();

        try {
            await verifyOtp({ email, otpCode });
            localStorage.removeItem("verifyEmail");
            navigate("/login");
        } catch {
            setMessage("Invalid or expired OTP.");
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleVerify}>
                <h2>Verify Email</h2>
                <p>Enter the OTP sent to your email</p>

                {message && <div className="error">{message}</div>}

                <input value={email || ""} disabled />

                <input
                    placeholder="Enter 6-digit OTP"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    maxLength="6"
                    required
                />

                <button className="btn primary full">Verify OTP</button>
            </form>
        </div>
    );
}

export default VerifyOtp;
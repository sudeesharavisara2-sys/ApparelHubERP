import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyResetOtp } from "../services/authService";

function VerifyResetOtp() {
    const navigate = useNavigate();

    const [otpCode, setOtpCode] = useState("");
    const [message, setMessage] = useState("");

    const email = localStorage.getItem("resetEmail");

    const handleVerify = async (e) => {
        e.preventDefault();

        try {
            await verifyResetOtp({ email, otpCode });
            navigate("/reset-password");
        } catch {
            setMessage("Invalid or expired reset OTP.");
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleVerify}>
                <h2>Verify Reset OTP</h2>
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

export default VerifyResetOtp;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/authService";

function ForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSendOtp = async (e) => {
        e.preventDefault();

        try {
            await forgotPassword({ email });
            localStorage.setItem("resetEmail", email);
            navigate("/verify-reset-otp");
        } catch {
            setMessage("Email not found.");
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleSendOtp}>
                <h2>Forgot Password</h2>
                <p>Enter your email to receive reset OTP</p>

                {message && <div className="error">{message}</div>}

                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <button className="btn primary full">Send OTP</button>
            </form>
        </div>
    );
}

export default ForgotPassword;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";

function ResetPassword() {
    const navigate = useNavigate();

    const email = localStorage.getItem("resetEmail");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleReset = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            await resetPassword({ email, newPassword });
            localStorage.removeItem("resetEmail");
            navigate("/login");
        } catch {
            setMessage("Password reset failed.");
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleReset}>
                <h2>Reset Password</h2>
                <p>Create your new password</p>

                {message && <div className="error">{message}</div>}

                <input value={email || ""} disabled />

                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <button className="btn primary full">Reset Password</button>
            </form>
        </div>
    );
}

export default ResetPassword;
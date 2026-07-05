import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";
import Logo from "../components/Logo"; 
import "./AuthCommon.css";

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
        <div className="auth-page" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
            <form className="auth-card" onSubmit={handleReset} style={{ width: "100%", maxWidth: "550px", padding: "30px", background: "white", borderRadius: "45px", boxShadow: "10px 10px 10px rgba(0,0,0,0.1)" }}>
                
                {/* Logo and Divider Section */}
                <div style={{ textAlign: "center", marginBottom: "30px", width: "100%" }}>
                    <Logo />
                     </div>
            
                {/* Heading */}
                <h2 style={{ textAlign: "left", fontSize: "24px", marginBottom: "15px"}}>Reset Password</h2>
                <p style={{ textAlign: "left", color: "#64748b", marginBottom: "20px", fontSize: "14px" }}>
                    Enter your new password below.
                </p>

                {message && <div style={{ marginBottom: "15px", color: "red", textAlign: "center", fontSize: "14px" }}>{message}</div>}

                {/* Email (Disabled input) */}
                <input 
                    value={email || ""} 
                    disabled 
                    style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #e2e8f0", textAlign: "center", background: "#f8fafc", cursor: "not-allowed" }} 
                />

                {/* Password Fields */}
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{ width: "100%", padding: "12px", marginBottom: "20px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                />

                <button type="submit" className="btn primary full" style={{ width: "100%", padding: "12px", cursor: "pointer", borderRadius: "8px" }}>
                    Reset Password
                </button>
            </form>
        </div>
    );
}

export default ResetPassword;
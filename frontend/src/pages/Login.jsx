import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo"; 
import "./AuthCommon.css";

function Login() {
    const navigate = useNavigate();
    const { saveUser } = useAuth();
    const [form, setForm] = useState({ username: "", password: "" });
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage(""); 
        setLoading(true);
        try {
            const res = await login(form);
            saveUser(res.data);
            navigate("/dashboard");
        } catch (err) {
            setMessage(err.response?.data?.message || "Login failed. Check your connection.");
        }finally {
            setLoading(false); 
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleLogin}>
                <div style={{ textAlign: "center" }}><Logo /></div>
                
                <br></br>
                 <h2
                    style={{
                        fontSize: "26px",
                        marginBottom: "2px",
                    }}
                >Welcome Back</h2>
                
                {message && <div className="error">{message}</div>}
<br></br>
                <label>Username</label>
                <input type="text" name="username" placeholder="Username" onChange={handleChange} autoComplete="username" required />

                <label>Password</label>
                <div style={{ position: 'relative' }}>
                    <input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" onChange={handleChange} autoComplete="current-password" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '10px', border: 'none', background: 'none', cursor: 'pointer' }}>
                        {showPassword ? "HIDE" : "SHOW"}
                    </button>
                </div>
<br></br>
                <Link to="/forgot-password" className="link">Forgot password?</Link>
                
                <button type="submit" className="btn primary full" disabled={loading}>
                    {loading ? "Signing In..." : "Sign In"}
                </button>
               <p></p>
                <p
                    className="small-text"
                    style={{ marginTop: "12px" }}
                >
                    Don't have an account?{" "}
                    <Link to="/register">Create account</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { saveUser } = useAuth();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const res = await login(form);
            saveUser(res.data);
            navigate("/dashboard");
        } catch (err) {
            if (err.response?.data?.message) {
                setMessage(err.response.data.message);
            } else {
                setMessage("Login failed. Please check backend connection.");
            }
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleLogin}>
                <h2>Welcome Back</h2>
                <p>Login to ApparelHub ERP</p>

                {message && <div className="error">{message}</div>}

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <button className="btn primary full">Login</button>

                <Link to="/forgot-password" className="link">
                    Forgot password?
                </Link>

                <p className="small-text">
                    Don&apos;t have an account? <Link to="/register">Create account</Link>
                </p>
            </form>
        </div>
    );
}  

export default Login;
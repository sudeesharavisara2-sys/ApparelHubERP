import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        role: "StoreManager",
    });

    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage("");
        setSuccess("");

        try {
            const res = await register(form);
            localStorage.setItem("verifyEmail", form.email);
            setSuccess(res.data.message || "Registration successful.");

            setTimeout(() => {
                navigate("/verify-otp");
            }, 1000);
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Registration failed. Please check backend connection."
            );
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-card large" onSubmit={handleRegister}>
                <h2>Create Account</h2>
                <p>Join ApparelHub ERP</p>

                {message && <div className="error">{message}</div>}
                {success && <div className="success">{success}</div>}

                <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} />

                <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />

                <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />

                <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />

                <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />

                <select name="role" value={form.role} onChange={handleChange}>
                    <option value="StoreManager">Store Manager</option>
                    <option value="Admin">Admin</option>
                    <option value="HROfficer">HR Officer</option>
                    <option value="PayrollOfficer">Payroll Officer</option>
                    <option value="InventoryManager">Inventory Manager</option>
                    <option value="ProcurementOfficer">Procurement Officer</option>
                    <option value="SalesCashier">Sales Cashier</option>
                    <option value="ExecutiveBoard">Executive Board</option>
                </select>

                <button className="btn primary full">Create Account</button>

                <p className="small-text">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}

export default Register;
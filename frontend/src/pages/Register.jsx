import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";
import Logo from "../components/Logo"; 
import "./AuthCommon.css";

// Register Component
function Register() {
    const navigate = useNavigate();

    // Form state
    const [form, setForm] = useState({
        fullName: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        role: "StoreManager",
    });

    // Message states
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState("");

    // Password visibility state
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Handle input field changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Allow only numeric values for the phone number
        if (name === "phone") {
            if (!/^\d*$/.test(value)) return;
        }

        setForm({ ...form, [name]: value });
    };

    // Handle registration form submission
    const handleRegister = async (e) => {
        e.preventDefault();

        // Clear previous messages
        setMessage("");
        setSuccess("");

        // Validate phone number length
        if (form.phone && form.phone.length !== 10) {
            setMessage("Phone number must be exactly 10 digits.");
            return;
        }
        setLoading(true);

        try {
            // Send registration request
            const res = await register(form);

            // Store email for OTP verification
            localStorage.setItem("verifyEmail", form.email);

            // Display success message
            setSuccess(res.data.message || "Registration successful.");

            // Redirect to OTP verification page
            setTimeout(() => {
                navigate("/verify-otp");
            }, 1000);

        } catch (err) {
            // Display error message
            setMessage(
                err.response?.data?.message ||
                "Registration failed. Please check backend connection."
            );
        }finally {
            setLoading(false); 
        }
    };

    // Reusable input label component
    const InputLabel = ({ text }) => (
        <div style={{ textAlign: "left", marginBottom: "2px" }}>
            <label
                style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#64748b",
                }}
            >
                {text}
            </label>
        </div>
    );

    return (
        <div
            className="auth-page"
            style={{ padding: "12px" }}
        >
            {/* Registration Card */}
            <form
                className="auth-card large animate-fade-in"
                onSubmit={handleRegister}
                autoComplete="off"
                style={{
                    padding: "24px 32px",
                    maxWidth: "580px", // Slightly wider card for two-column layout
                }}
            >
               

{/* ApparelHub ERP Main Topic */}
<h1 className="brand-logo" style={{ fontSize: "40px", marginBottom: "20px" }}>
    Apparel<span>Hub</span> <small>ERP</small>
</h1>

                {/* Page Heading */}
                <h2
                    style={{
                        fontSize: "26px",
                        marginBottom: "2px",
                    }}
                >
                    Create Account
                </h2>

                <p
                    style={{
                        marginBottom: "16px",
                        fontSize: "13px",
                    }}
                >
                    Join the enterprise management console
                </p>

                {/* Error Message */}
                {message && (
                    <div
                        className="error"
                        style={{
                            padding: "8px",
                            marginBottom: "12px",
                            fontSize: "13px",
                        }}
                    >
                        {message}
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div
                        className="success"
                        style={{
                            padding: "8px",
                            marginBottom: "12px",
                            fontSize: "13px",
                        }}
                    >
                        {success}
                    </div>
                )}

                {/* Two-column registration form */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px",
                    }}
                >
                    {/* Full Name */}
                    <div>
                        <InputLabel text="Full Name" />
                        <input
                            name="fullName"
                            placeholder="Full Name"
                            value={form.fullName}
                            onChange={handleChange}
                            style={{
                                padding: "10px 12px",
                                marginBottom: "8px",
                                borderRadius: "10px",
                            }}
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <InputLabel text="Username " />
                        <input
                            name="username"
                            placeholder="Username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            style={{
                                padding: "10px 12px",
                                marginBottom: "8px",
                                borderRadius: "10px",
                            }}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <InputLabel text="Email Address " />
                        <input
                            name="email"
                            type="email"
                            placeholder="Email Address"
                            value={form.email}
                            onChange={handleChange}
                            required
                            style={{
                                padding: "10px 12px",
                                marginBottom: "8px",
                                borderRadius: "10px",
                            }}
                        />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <InputLabel text="Phone Number" />
                        <input
                            name="phone"
                            type="text"
                            placeholder="Phone Number"
                            value={form.phone}
                            onChange={handleChange}
                            maxLength={10} 
                            pattern="[0-9]{10}"
                            style={{
                                padding: "10px 12px",
                                marginBottom: "8px",
                                borderRadius: "10px",
                            }}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <InputLabel text="Password" />

                        <div style={{ position: "relative" }}>
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
                                style={{
                                    padding: "10px 12px",
                                    marginBottom: "0px",
                                    borderRadius: "10px",
                                    paddingRight: "50px",
                                }}
                            />

                            {/* Show/Hide Password Button */}
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                style={{
                                    position: "absolute",
                                    right: "12px",
                                    top: "12px",
                                    background: "none",
                                    border: "none",
                                    color: "#64748b",
                                    fontSize: "10px",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                }}
                            >
                                {showPassword ? "HIDE" : "SHOW"}
                            </button>
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div>
                        <InputLabel text="Assign System Role" />

                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            style={{
                                padding: "10px 12px",
                                marginBottom: "0px",
                                borderRadius: "10px",
                                height: "41px",
                            }}
                        >
                            <option value="StoreManager">
                                Store Manager
                            </option>
                            <option value="Admin">
                                System Admin
                            </option>
                            <option value="HROfficer">
                                HR Officer
                            </option>
                            <option value="PayrollOfficer">
                                Payroll Officer
                            </option>
                            <option value="InventoryManager">
                                Inventory Manager
                            </option>
                            <option value="ProcurementOfficer">
                                Procurement Officer
                            </option>
                            <option value="SalesCashier">
                                Sales Cashier
                            </option>
                            <option value="ExecutiveBoard">
                                Executive Board
                            </option>
                        </select>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="btn primary full"
                    disabled={loading}
                    style={{
                        padding: "12px",
                        borderRadius: "10px",
                        marginTop: "20px",
                        cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? "Creating Account..." : "Create Account"}
                    
                </button>

                {/* Login Link */}
                <p
                    className="small-text"
                    style={{ marginTop: "14px" }}
                >
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}

export default Register;
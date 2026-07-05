import { Link } from "react-router-dom";
import "./AuthCommon.css";

function Landing() {
    return (
        <div className="auth-page">
            <div className="auth-card landing-card">

                

                {/* Main Brand */}
                <h1 className="brand-logo">
                    Apparel<span>Hub</span>
                    <small>ERP</small>
                </h1>
                <p>

                </p>

            

                {/* Description */}
                <p className="landing-description">
                    A complete Enterprise Resource Planning solution developed
                    for apparel businesses. Manage employees, inventory,
                    suppliers, procurement, payroll, sales, and business
                    operations through one centralized platform.
                </p>

                {/* Buttons */}
                <div className="landing-actions">
                    <Link to="/login" className="btn primary full">
                        Login
                    </Link>

                    <Link to="/register" className="btn secondary full">
                        Create Account
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default Landing;
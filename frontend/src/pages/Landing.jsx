import { Link } from "react-router-dom";

function Landing() {
    return (
        <div className="landing-page">
            <div className="landing-card">
                <div className="badge">ERP System</div>

                <h1>ApparelHub ERP</h1>

                <p>
                    Smart apparel management system for employees, inventory, suppliers,
                    sales, and business analytics.
                </p>

                <div className="landing-actions">
                    <Link to="/login" className="btn primary">
                        Get Started
                    </Link>

                    <Link to="/register" className="btn secondary">
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Landing;
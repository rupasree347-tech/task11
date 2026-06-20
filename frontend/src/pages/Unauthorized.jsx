import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div className="auth-container">
      <h2>Access Denied</h2>
      <p className="auth-helper-text">
        You don't have permission to view this page.
      </p>
      <Link to="/">Back to Login</Link>
    </div>
  );
}

export default Unauthorized;

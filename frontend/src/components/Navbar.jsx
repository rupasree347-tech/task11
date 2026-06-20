import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Navbar({ onMenuClick, sidebarOpen }) {

  const navigate = useNavigate();

  const handleLogout = async () => {

    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/auth/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      // Even if the server call fails, still clear the local session
      console.log(error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <div className="navbar">

      <div className="navbar-left">
        {/* Hamburger menu: only visible on mobile via CSS, toggles the sidebar */}
        <button
          className="menu-toggle-btn"
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
          aria-expanded={sidebarOpen}
        >
          <span className="menu-bar" />
          <span className="menu-bar" />
          <span className="menu-bar" />
        </button>

        <h2>RBAC System</h2>
      </div>

      <button
        className="logout-btn"
        onClick={handleLogout}
      >
        Logout
      </button>

    </div>
  );
}

export default Navbar;

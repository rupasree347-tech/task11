import { Link } from "react-router-dom";

function Sidebar({ isOpen, onLinkClick }) {

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const handleClick = () => {
    if (onLinkClick) onLinkClick();
  };

  return (
    <div className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>

      <h3>{user?.role}</h3>

      <Link to="/profile" onClick={handleClick}>
        Profile
      </Link>

      {user?.role === "Admin" && (
        <>
          <Link to="/admin" onClick={handleClick}>
            Dashboard
          </Link>
          <Link to="/role-management" onClick={handleClick}>
            Role Management
          </Link>
        </>
      )}

      {user?.role === "Manager" && (
        <Link to="/manager" onClick={handleClick}>
          Dashboard
        </Link>
      )}

      {user?.role === "Instructor" && (
        <Link to="/instructor" onClick={handleClick}>
          Dashboard
        </Link>
      )}

      {user?.role === "Student" && (
        <Link to="/student" onClick={handleClick}>
          Dashboard
        </Link>
      )}

    </div>
  );
}

export default Sidebar;

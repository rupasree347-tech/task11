import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      <Navbar onMenuClick={toggleSidebar} sidebarOpen={sidebarOpen} />

      <div className="layout">
        <Sidebar isOpen={sidebarOpen} onLinkClick={closeSidebar} />

        {/* Overlay closes the sidebar when tapping outside it on mobile */}
        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        <div className="content">{children}</div>
      </div>
    </>
  );
}

export default DashboardLayout;

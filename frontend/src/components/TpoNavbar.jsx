import { NavLink, useNavigate } from "react-router-dom";

function TpoNavbar() {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
      : "text-blue-700 px-4 py-2 rounded-md hover:bg-blue-100 hover:text-blue-800 font-medium";

  /* ✅ FIXED LOGOUT */
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");

    navigate("/signin", { replace: true });
  };

  return (
    <header className="fixed top-0 left-0 w-full h-[60px] bg-white border-b border-blue-200 flex items-center justify-between px-10 z-50 shadow-sm">
      <div className="text-blue-700 font-bold text-xl">
        DDU Placement Portal
      </div>

      <nav className="flex gap-2 items-center">
        <NavLink to="/tpo-dashboard" className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/tpo/manage-students" className={linkClass}>
          Student Management
        </NavLink>
        <NavLink to="/tpo/resume-insights" className={linkClass}>
          Resume Insights
        </NavLink>
        <NavLink to="/tpo/notifications" className={linkClass}>
                  Notifications
        </NavLink>
        <NavLink to="/tpo/application-tracker" className={linkClass}>
          Application Tracker
        </NavLink>
        <NavLink to="/tpo/placement-summary" className={linkClass}>
          Placement Summary
        </NavLink>


        <button
          onClick={handleLogout}
          className="ml-6 text-white bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md font-medium transition-colors duration-200"
        >
          Logout
        </button>
      </nav>
    </header>
  );
}

export default TpoNavbar;

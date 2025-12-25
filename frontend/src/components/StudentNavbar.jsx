import { NavLink, useNavigate } from "react-router";

function StudentNavbar() {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
      : "text-blue-700 px-4 py-2 rounded-md hover:bg-blue-100 hover:text-blue-800 font-medium";

  const handleLogout = () => {
    localStorage.removeItem("role");
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="fixed top-0 left-0 w-full h-[60px] bg-white border-b border-blue-200 flex items-center justify-between px-10 z-50 shadow-sm">
      <div className="text-blue-700 font-bold text-xl">DDU Placement Portal | Student</div>

      <nav className="flex gap-2 items-center">
        <NavLink to="/" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/profile" className={linkClass}>Profile</NavLink>
        <NavLink to="/notifications" className={linkClass}>Notifications</NavLink>
        <NavLink to="/jobs" className={linkClass}>Job Applications</NavLink>
        <NavLink to="/status" className={linkClass}>Placement Status</NavLink>
        <NavLink to="/about" className={linkClass}>About TPO</NavLink>

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

export default StudentNavbar;

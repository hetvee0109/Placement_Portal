// import React from "react";
// import { Link, useNavigate } from "react-router";
//
// export default function StudentNavbar() {
//   const navigate = useNavigate();
//   const userEmail = localStorage.getItem("userEmail");
//
//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/signin");
//   };
//
//   return (
//     <nav className="bg-white shadow-md border-b border-gray-100">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             <Link to="/student-dashboard" className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">D</div>
//               <span className="text-xl font-bold text-gray-800">DDU Portal</span>
//             </Link>
//           </div>
//           <div className="flex items-center space-x-4">
//             <Link to="/student-dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
//             <Link to="/student/profile" className="text-gray-600 hover:text-blue-600">Profile</Link>
//             <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold">Logout</button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }
// // DO NOT ADD ANY EXPORT DEFAULT AT THE BOTTOM

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

// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
//
// export default function TpoNavbar() {
//   const navigate = useNavigate();
//   const userEmail = localStorage.getItem("userEmail") || "TPO Admin";
//
//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/signin");
//   };
//
//   return (
//     <nav className="bg-white shadow-md border-b border-indigo-100 fixed w-full top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           {/* Logo */}
//           <div className="flex items-center">
//             <Link to="/tpo-dashboard" className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
//                 <span className="text-white font-bold text-xl">T</span>
//               </div>
//               <span className="text-xl font-bold text-gray-800">
//                 TPO <span className="text-indigo-600">Portal</span>
//               </span>
//             </Link>
//           </div>
//
//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center space-x-8">
//             <Link to="/tpo-dashboard" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Dashboard</Link>
//             <Link to="/tpo/manage-students" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Students</Link>
//             <Link to="/tpo/application-tracker" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Tracker</Link>
//           </div>
//
//           {/* User Actions */}
//           <div className="flex items-center space-x-4">
//             <div className="text-right hidden sm:block">
//               <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Administrator</p>
//               <p className="text-xs font-medium text-gray-600">{userEmail}</p>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-sm"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }


import { NavLink, useNavigate } from "react-router";

function TpoNavbar() {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
      : "text-blue-700 px-4 py-2 rounded-md hover:bg-blue-100 hover:text-blue-800 font-medium";

  const handleLogout = () => {
    localStorage.removeItem("role"); // clear role
    navigate("/");                  // go to role select
    window.location.reload();       // reset UI
  };

  return (
    <header className="fixed top-0 left-0 w-full h-[60px] bg-white border-b border-blue-200 flex items-center justify-between px-10 z-50 shadow-sm">
      <div className="text-blue-700 font-bold text-xl">DDU Placements</div>

      <nav className="flex gap-2 items-center">
        <NavLink to="/" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/studentmanagement" className={linkClass}>Student Management</NavLink>
        <NavLink to="/resumeinsights" className={linkClass}>Resume Insights</NavLink>
        <NavLink to="/applicationtracker" className={linkClass}>Application Tracker</NavLink>
        <NavLink to="/resultportal" className={linkClass}>Result Portal</NavLink>
        <NavLink to="/placementsummary" className={linkClass}>Placement Summary</NavLink>
        <NavLink to="/notifications" className={linkClass}>Notifications</NavLink>

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

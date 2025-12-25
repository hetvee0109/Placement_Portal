// import React from "react";
// import TpoNavbar from "./TpoNavbar";
//
// export default function TPODashboard() {
//   return (
//     <div className="min-h-screen bg-slate-50">
//       <TpoNavbar />
//
//       <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
//         <header className="mb-8">
//           <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Placement Overview</h1>
//           <p className="text-gray-500 mt-1">Manage student records and track hiring progress.</p>
//         </header>
//
//         {/* Analytics Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//           <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//             <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Total Registered</p>
//             <p className="text-4xl font-black text-gray-800 mt-2">120</p>
//             <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
//               <div className="h-full bg-indigo-500 w-full"></div>
//             </div>
//           </div>
//
//           <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//             <p className="text-xs font-bold text-green-500 uppercase tracking-wider">Placed Students</p>
//             <p className="text-4xl font-black text-gray-800 mt-2">75</p>
//             <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
//               <div className="h-full bg-green-500 w-[62%]"></div>
//             </div>
//           </div>
//
//           <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//             <p className="text-xs font-bold text-orange-500 uppercase tracking-wider">In Process</p>
//             <p className="text-4xl font-black text-gray-800 mt-2">45</p>
//             <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
//               <div className="h-full bg-orange-500 w-[38%]"></div>
//             </div>
//           </div>
//         </div>
//
//         {/* Action Center */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//             <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <button className="p-3 text-sm font-semibold bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors">
//                 Add New Company
//               </button>
//               <button className="p-3 text-sm font-semibold bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors">
//                 Export Reports
//               </button>
//             </div>
//           </div>
//
//           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 italic">
//             Dashboard analytics chart will appear here...
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


// src/pages/Dashboard.jsx
const TPODashboard = () => (
  <div className="pt-[80px] p-6">
    <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-4 bg-blue-50 rounded shadow">Total Students: 120</div>
      <div className="p-4 bg-blue-50 rounded shadow">Placed Students: 75</div>
      <div className="p-4 bg-blue-50 rounded shadow">Pending Applications: 45</div>
    </div>
  </div>
);
export default TPODashboard;

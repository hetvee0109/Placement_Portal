// import React, { useEffect, useState } from "react";
//
// const ApplicationTracker = () => {
//   const [companies, setCompanies] = useState([]);
//   const [openCompany, setOpenCompany] = useState(null);
//
//   useEffect(() => {
//     fetch("http://localhost:8080/api/notifications/company-wise")
//       .then(res => res.json())
//       .then(data => setCompanies(data))
//       .catch(err => console.error("Company-wise tracker error:", err));
//   }, []);
//
//   const updateStatus = (applicationId, status) => {
//     fetch(
//       `http://localhost:8080/api/application-status/update?applicationId=${applicationId}&status=${status}`,
//       { method: "POST" }
//     )
//       .then(() => {
//         setCompanies(prev =>
//           prev.map(company => ({
//             ...company,
//             applications: company.applications.map(app =>
//               app.id === applicationId
//                 ? { ...app, status }
//                 : app
//             )
//           }))
//         );
//       })
//       .catch(err => console.error(err));
//   };
//
//   const renderStatus = (status) => {
//     if (status === "SELECTED")
//       return <span className="text-green-600 font-bold text-xs">SELECTED</span>;
//     if (status === "REJECTED")
//       return <span className="text-red-600 font-bold text-xs">REJECTED</span>;
//     return null;
//   };
//
//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
//       <h2 className="text-2xl font-black text-gray-800 mb-6">
//         Application Tracker (Company-wise)
//       </h2>
//
//       {companies.length === 0 && (
//         <p className="text-gray-400 italic">No applications found.</p>
//       )}
//
//       {companies.map(company => (
//         <div
//           key={company.companyName}
//           className="mb-6 border rounded-xl overflow-hidden"
//         >
//           {/* Company Card */}
//           <div
//             className="bg-indigo-50 px-6 py-4 font-bold text-indigo-800 cursor-pointer"
//             onClick={() =>
//               setOpenCompany(
//                 openCompany === company.companyName
//                   ? null
//                   : company.companyName
//               )
//             }
//           >
//             {company.companyName}
//           </div>
//
//           {/* Student List */}
//           {openCompany === company.companyName && (
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-gray-50 text-xs uppercase text-gray-500">
//                   <th className="px-6 py-3">Student Name</th>
//                   <th className="px-6 py-3">Email</th>
//                   <th className="px-6 py-3">Status / Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {company.applications.map(app => (
//                   <tr key={app.id} className="border-t">
//                     <td className="px-6 py-3 font-medium">
//                       {app.student.name}
//                     </td>
//                     <td className="px-6 py-3 text-sm text-gray-600">
//                       {app.student.email}
//                     </td>
//                     <td className="px-6 py-3">
//                       {app.status === "PENDING" ? (
//                         <div className="space-x-3">
//                           <button
//                             onClick={() =>
//                               updateStatus(app.id, "SELECTED")
//                             }
//                             className="px-3 py-1 bg-green-500 text-white rounded-md text-xs"
//                           >
//                             Select
//                           </button>
//                           <button
//                             onClick={() =>
//                               updateStatus(app.id, "REJECTED")
//                             }
//                             className="px-3 py-1 bg-red-500 text-white rounded-md text-xs"
//                           >
//                             Reject
//                           </button>
//                         </div>
//                       ) : (
//                         renderStatus(app.status)
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };
//
// export default ApplicationTracker;


import React, { useEffect, useState } from "react";

const ApplicationTracker = () => {
  const [companies, setCompanies] = useState([]);
  const [openCompany, setOpenCompany] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/notifications/company-wise")
      .then(res => res.json())
      .then(data => setCompanies(data))
      .catch(err => console.error("Company-wise tracker error:", err));
  }, []);

  // NEW LOGIC: Handle Selection with CTC
  const handleSelect = async (appId) => {
    const ctc = prompt("Please enter the Final CTC (LPA) for this student:");

    if (ctc === null || ctc === "" || isNaN(ctc)) {
      alert("Invalid CTC. Selection cancelled.");
      return;
    }

    try {
      // Calls the new PlacementSummaryController endpoint
      const response = await fetch(
        `http://localhost:8080/api/placements/select-student/${appId}?ctc=${ctc}`,
        { method: "POST" }
      );

      if (response.ok) {
        updateLocalUI(appId, "SELECTED");
        alert("Student successfully placed and added to Summary!");
      } else {
        alert("Failed to update status. Please check backend.");
      }
    } catch (err) {
      console.error("Selection error:", err);
    }
  };

  // Standard Rejection Logic
  const handleReject = (appId) => {
    fetch(
      `http://localhost:8080/api/application-status/update?applicationId=${appId}&status=REJECTED`,
      { method: "POST" }
    )
      .then(() => updateLocalUI(appId, "REJECTED"))
      .catch(err => console.error(err));
  };

  // Helper to update the state without re-fetching everything
  const updateLocalUI = (appId, newStatus) => {
    setCompanies(prev =>
      prev.map(company => ({
        ...company,
        applications: company.applications.map(app =>
          app.id === appId ? { ...app, status: newStatus } : app
        )
      }))
    );
  };

  const renderStatus = (status) => {
    if (status === "SELECTED")
      return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold text-xs">SELECTED</span>;
    if (status === "REJECTED")
      return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-bold text-xs">REJECTED</span>;
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-black text-gray-800 mb-6">
        Application Tracker (Company-wise)
      </h2>

      {companies.length === 0 && (
        <p className="text-gray-400 italic">No applications found.</p>
      )}

      {companies.map(company => (
        <div key={company.companyName} className="mb-6 border rounded-xl overflow-hidden shadow-sm">
          <div
            className="bg-indigo-50 px-6 py-4 font-bold text-indigo-800 cursor-pointer flex justify-between items-center"
            onClick={() => setOpenCompany(openCompany === company.companyName ? null : company.companyName)}
          >
            <span>{company.companyName}</span>
            <span className="text-sm font-normal bg-indigo-200 px-2 py-1 rounded text-indigo-900">
                {company.applications.length} Applicants
            </span>
          </div>

          {openCompany === company.companyName && (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 text-xs uppercase text-gray-500">
                    <th className="px-6 py-3">Student Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3 text-center">Status / Action</th>
                    </tr>
                </thead>
                <tbody>
                    {company.applications.map(app => (
                    <tr key={app.id} className="border-t hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 font-medium text-gray-800">{app.student.name}</td>
                        <td className="px-6 py-3 text-sm text-gray-600">{app.student.email}</td>
                        <td className="px-6 py-3 text-center">
                        {app.status === "PENDING" ? (
                            <div className="flex justify-center space-x-2">
                            <button
                                onClick={() => handleSelect(app.id)}
                                className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                            >
                                Select
                            </button>
                            <button
                                onClick={() => handleReject(app.id)}
                                className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                            >
                                Reject
                            </button>
                            </div>
                        ) : (
                            renderStatus(app.status)
                        )}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ApplicationTracker;

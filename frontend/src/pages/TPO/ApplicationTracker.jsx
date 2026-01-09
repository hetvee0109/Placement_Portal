import React, { useState, useEffect } from "react";

const ApplicationTracker = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch data whenever searchTerm changes
    const delayDebounce = setTimeout(() => {
      fetch(`http://localhost:8080/api/notifications/applications?company=${searchTerm}`)
        .then((res) => res.json())
        .then((data) => setApplications(data))
        .catch((err) => console.error("Tracker Error:", err));
    }, 300); // 300ms debounce to prevent excessive API calls

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Application Tracker</h2>
          <p className="text-gray-400 text-sm">Monitor student drive participation</p>
        </div>
        
        {/* Company Filter Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Company Name..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest font-bold">
              <th className="px-6 py-4 border-b">Student Name</th>
              <th className="px-6 py-4 border-b">Email</th>
              <th className="px-6 py-4 border-b">CPI</th>
              <th className="px-6 py-4 border-b">Company</th>
              <th className="px-6 py-4 border-b">Applied Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {applications.length > 0 ? (
              applications.map((app) => (
                <tr key={app.id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-700">{app.student.name}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{app.student.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold">
                      {app.student.cpi}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-indigo-700 font-bold">{app.notification.companyName}</td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-400 italic">
                  No applications found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationTracker;
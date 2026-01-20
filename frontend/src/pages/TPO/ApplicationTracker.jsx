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

  const updateStatus = (applicationId, status) => {
    fetch(
      `http://localhost:8080/api/application-status/update?applicationId=${applicationId}&status=${status}`,
      { method: "POST" }
    )
      .then(() => {
        // 🔥 Update UI state without refetch
        setCompanies(prev =>
          prev.map(company => ({
            ...company,
            applications: company.applications.map(app =>
              app.id === applicationId
                ? { ...app, status }
                : app
            )
          }))
        );
      })
      .catch(err => console.error(err));
  };

  const renderStatus = (status) => {
    if (status === "SELECTED")
      return <span className="text-green-600 font-bold text-xs">SELECTED</span>;
    if (status === "REJECTED")
      return <span className="text-red-600 font-bold text-xs">REJECTED</span>;
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
        <div
          key={company.companyName}
          className="mb-6 border rounded-xl overflow-hidden"
        >
          {/* Company Card */}
          <div
            className="bg-indigo-50 px-6 py-4 font-bold text-indigo-800 cursor-pointer"
            onClick={() =>
              setOpenCompany(
                openCompany === company.companyName
                  ? null
                  : company.companyName
              )
            }
          >
            {company.companyName}
          </div>

          {/* Student List */}
          {openCompany === company.companyName && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase text-gray-500">
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Status / Action</th>
                </tr>
              </thead>
              <tbody>
                {company.applications.map(app => (
                  <tr key={app.id} className="border-t">
                    <td className="px-6 py-3 font-medium">
                      {app.student.name}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {app.student.email}
                    </td>
                    <td className="px-6 py-3">
                      {app.status === "PENDING" ? (
                        <div className="space-x-3">
                          <button
                            onClick={() =>
                              updateStatus(app.id, "SELECTED")
                            }
                            className="px-3 py-1 bg-green-500 text-white rounded-md text-xs"
                          >
                            Select
                          </button>
                          <button
                            onClick={() =>
                              updateStatus(app.id, "REJECTED")
                            }
                            className="px-3 py-1 bg-red-500 text-white rounded-md text-xs"
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
          )}
        </div>
      ))}
    </div>
  );
};

export default ApplicationTracker;

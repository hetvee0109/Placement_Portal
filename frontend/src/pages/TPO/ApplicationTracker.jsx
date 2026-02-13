import React, { useEffect, useState } from "react";
import axios from "axios";

const ApplicationTracker = () => {
  const [companies, setCompanies] = useState([]);
  const [openCompanyKey, setOpenCompanyKey] = useState(null);
  const [selections, setSelections] = useState({});
  const [editMode, setEditMode] = useState({});
  const [saving, setSaving] = useState({});
  const [searchTerms, setSearchTerms] = useState({}); // ✅ NEW

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Fetch company-wise data
  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/notifications/company-wise"
      );

      setCompanies(res.data || []);

      // ✅ Pre-load selected ids
      const initialSelections = {};
      (res.data || []).forEach((company) => {
        const companyKey = company.companyName;

        initialSelections[companyKey] = (company.applications || [])
          .filter((app) => app.status === "SELECTED")
          .map((app) => app.student?.id)
          .filter(Boolean);
      });

      setSelections(initialSelections);
    } catch (err) {
      console.error("Fetch failed:", err);
      alert("Failed to load company-wise applications. Check backend.");
    }
  };

  // ✅ POPUP FUNCTION: Ask CTC ONCE and save for ALL selected students
  const askAndSaveCTC_Once = async (
    notificationId,
    companyName,
    selectedApps
  ) => {
    if (!selectedApps || selectedApps.length === 0) return;

    let ctcInput = prompt(
      `🎓 FINAL CTC ENTRY\n\nCompany: ${companyName}\nSelected Students: ${selectedApps.length}\n\nEnter Final CTC (LPA) for ALL selected students:`
    );

    if (ctcInput === null) {
      alert("CTC entry cancelled. Placement records not saved.");
      return;
    }

    ctcInput = ctcInput.trim();

    if (!ctcInput || isNaN(ctcInput) || Number(ctcInput) <= 0) {
      alert("❌ Invalid CTC. Please enter a valid number like 6 or 8.5");
      return await askAndSaveCTC_Once(notificationId, companyName, selectedApps);
    }

    const finalCtc = Number(ctcInput);

    // ✅ Save placement record for ALL selected students with SAME CTC
    for (const app of selectedApps) {
      const studentId = app.student?.id;
      if (!studentId) continue;

      await axios.post("http://localhost:8080/api/placements/save", {
        jobId: Number(notificationId),
        studentId: Number(studentId),
        finalCtc: finalCtc,
      });
    }
  };

  // ✅ SAVE RESULTS for one company block
  const saveResults = async (company) => {
    const companyKey = company.companyName;

    const firstApp = company.applications?.[0];
    const notificationId = firstApp?.notification?.id;

    if (!notificationId) {
      alert("Notification ID not found for this company. Backend data issue.");
      return;
    }

    const selectedIds = selections[companyKey] || [];

    const payload = {
      jobId: Number(notificationId),
      selectedStudentIds: selectedIds,
    };

    try {
      setSaving((prev) => ({ ...prev, [companyKey]: true }));

      // ✅ 1) Save Selected/Rejected in applications table
      await axios.post(
        "http://localhost:8080/api/v2/applications/bulk-update",
        payload
      );

      // ✅ 2) Now popup CTC ONLY ONCE for selected students
      const selectedApps = (company.applications || []).filter((app) =>
        selectedIds.includes(app.student?.id)
      );

      if (selectedApps.length > 0) {
        await askAndSaveCTC_Once(
          notificationId,
          company.companyName,
          selectedApps
        );
      }

      alert("✅ Results Published + Placement Records Saved!");

      setEditMode((prev) => ({ ...prev, [companyKey]: false }));
      await fetchData();
    } catch (err) {
      console.error("Save results failed:", err);

      if (err.response?.data) {
        alert("❌ Error: " + JSON.stringify(err.response.data));
      } else {
        alert("❌ Failed to update results. Check backend logs.");
      }
    } finally {
      setSaving((prev) => ({ ...prev, [companyKey]: false }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-3xl shadow-sm border">
      <h2 className="text-2xl font-black mb-6">Result Management</h2>

      {companies.map((company) => {
        const companyKey = company.companyName;
        const searchTerm = searchTerms[companyKey] || "";

        // ✅ Filter students inside company
        const filteredApplications = (company.applications || []).filter(
          (app) => {
            const name = app.student?.name?.toLowerCase() || "";
            const email = app.student?.email?.toLowerCase() || "";
            const term = searchTerm.toLowerCase();

            return name.includes(term) || email.includes(term);
          }
        );

        return (
          <div
            key={companyKey}
            className="mb-4 border rounded-xl overflow-hidden"
          >
            {/* Company Card */}
            <div
              className="px-6 py-4 flex justify-between bg-indigo-50 cursor-pointer"
              onClick={() =>
                setOpenCompanyKey(
                  openCompanyKey === companyKey ? null : companyKey
                )
              }
            >
              <span className="font-bold text-indigo-900">
                {company.companyName}
              </span>

              <span className="text-sm bg-indigo-200 px-3 py-1 rounded-full">
                {company.applications?.length || 0} Students
              </span>
            </div>

            {/* Open Company Panel */}
            {openCompanyKey === companyKey && (
              <div className="p-6 bg-white border-t">
                {/* Edit Button */}
                {!editMode[companyKey] && (
                  <button
                    onClick={() =>
                      setEditMode((prev) => ({ ...prev, [companyKey]: true }))
                    }
                    className="mb-4 bg-amber-500 text-white px-4 py-2 rounded-lg text-xs font-bold"
                  >
                    EDIT RESULTS
                  </button>
                )}

                {/* ✅ SEARCH BAR ADDED */}
                <div className="mb-4">
                  <input
                    type="text"
                    value={searchTerm}
                    placeholder="Search student name or email..."
                    onChange={(e) =>
                      setSearchTerms((prev) => ({
                        ...prev,
                        [companyKey]: e.target.value,
                      }))
                    }
                    className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>

                <table className="w-full">
                  <thead>
                    <tr className="text-[10px] font-black text-gray-400 uppercase border-b">
                      {editMode[companyKey] && (
                        <th className="py-3 text-left">Select</th>
                      )}
                      <th className="py-3 text-left">Student</th>
                      <th className="py-3 text-right">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredApplications.map((app) => {
                      const studentId = app.student?.id;
                      const isSelected =
                        selections[companyKey]?.includes(studentId);

                      return (
                        <tr key={app.id} className="border-b hover:bg-gray-50">
                          {/* Checkbox */}
                          {editMode[companyKey] && (
                            <td className="py-3">
                              <input
                                type="checkbox"
                                checked={!!isSelected}
                                onChange={() => {
                                  if (!studentId) return;

                                  const current = selections[companyKey] || [];

                                  const newSel = current.includes(studentId)
                                    ? current.filter((id) => id !== studentId)
                                    : [...current, studentId];

                                  setSelections((prev) => ({
                                    ...prev,
                                    [companyKey]: newSel,
                                  }));
                                }}
                              />
                            </td>
                          )}

                          <td className="py-3 font-bold">
                            {app.student?.name || "N/A"}
                            <div className="text-xs text-gray-400 font-medium">
                              {app.student?.email}
                            </div>
                          </td>

                          <td className="py-3 text-right">
                            {editMode[companyKey] ? (
                              <span
                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                  isSelected
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {isSelected ? "SELECTED" : "REJECTED"}
                              </span>
                            ) : (
                              <span
                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                  app.status === "SELECTED"
                                    ? "bg-green-100 text-green-700"
                                    : app.status === "REJECTED"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {app.status}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Save Button */}
                {editMode[companyKey] && (
                  <button
                    disabled={saving[companyKey]}
                    onClick={() => saveResults(company)}
                    className={`w-full mt-4 bg-indigo-600 text-white py-3 rounded-xl font-black ${
                      saving[companyKey] ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    {saving[companyKey] ? "SAVING..." : "SAVE RESULTS"}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ApplicationTracker;

import React, { useEffect, useState } from "react";
import axios from "axios";

const ApplicationTracker = () => {
  const [companies, setCompanies] = useState([]);
  const [openCompanyKey, setOpenCompanyKey] = useState(null);
  const [selections, setSelections] = useState({});
  const [editMode, setEditMode] = useState({});
  const [saving, setSaving] = useState({});
  const [searchTerms, setSearchTerms] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/notifications/company-wise");
      setCompanies(res.data || []);

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
    }
  };

  // ✅ NEW: SELECT ALL LOGIC
  const handleSelectAll = (companyKey, filteredApps) => {
    const currentSelected = selections[companyKey] || [];
    const filteredIds = filteredApps.map(app => app.student?.id).filter(Boolean);

    // Check if all filtered students are already selected
    const allSelected = filteredIds.every(id => currentSelected.includes(id));

    if (allSelected) {
      // Unselect only the filtered ones
      setSelections(prev => ({
        ...prev,
        [companyKey]: prev[companyKey].filter(id => !filteredIds.includes(id))
      }));
    } else {
      // Add filtered ones to existing selections (using Set to prevent duplicates)
      setSelections(prev => ({
        ...prev,
        [companyKey]: [...new Set([...prev[companyKey], ...filteredIds])]
      }));
    }
  };

  const askAndSaveCTC_Once = async (notificationId, companyName, selectedApps) => {
    if (!selectedApps || selectedApps.length === 0) return;
    let ctcInput = prompt(`🎓 FINAL CTC ENTRY\n\nCompany: ${companyName}\nStudents: ${selectedApps.length}\nEnter CTC (LPA):`);
    if (!ctcInput) return;

    const finalCtc = Number(ctcInput);
    for (const app of selectedApps) {
      await axios.post("http://localhost:8080/api/placements/save", {
        jobId: Number(notificationId),
        studentId: Number(app.student?.id),
        finalCtc: finalCtc,
      });
    }
  };

  const saveResults = async (company) => {
    const companyKey = company.companyName;
    const notificationId = company.applications?.[0]?.notification?.id;
    if (!notificationId) return;

    try {
      setSaving(prev => ({ ...prev, [companyKey]: true }));
      await axios.post("http://localhost:8080/api/v2/applications/bulk-update", {
        jobId: Number(notificationId),
        selectedStudentIds: selections[companyKey] || [],
      });

      const selectedApps = (company.applications || []).filter(app => selections[companyKey]?.includes(app.student?.id));
      if (selectedApps.length > 0) {
        await askAndSaveCTC_Once(notificationId, company.companyName, selectedApps);
      }

      alert("✅ Results Published!");
      setEditMode(prev => ({ ...prev, [companyKey]: false }));
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(prev => ({ ...prev, [companyKey]: false }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-3xl shadow-sm border">
      <h2 className="text-2xl font-black mb-6">Result Management</h2>

      {companies.map((company) => {
        const companyKey = company.companyName;
        const searchTerm = searchTerms[companyKey] || "";
        const filteredApplications = (company.applications || []).filter(app => {
          const search = searchTerm.toLowerCase();
          return app.student?.name?.toLowerCase().includes(search) || app.student?.email?.toLowerCase().includes(search);
        });

        // Determine if "Select All" checkbox should be checked
        const filteredIds = filteredApplications.map(a => a.student?.id).filter(Boolean);
        const isAllSelected = filteredIds.length > 0 && filteredIds.every(id => (selections[companyKey] || []).includes(id));

        return (
          <div key={companyKey} className="mb-4 border rounded-xl overflow-hidden">
            <div
              className="px-6 py-4 flex justify-between bg-indigo-50 cursor-pointer items-center"
              onClick={() => setOpenCompanyKey(openCompanyKey === companyKey ? null : companyKey)}
            >
              <span className="font-bold text-indigo-900 text-lg uppercase">{company.companyName}</span>
              <span className="text-xs font-black bg-indigo-200 text-indigo-700 px-4 py-1.5 rounded-full">
                {company.applications?.length || 0} APPLICANTS
              </span>
            </div>

            {openCompanyKey === companyKey && (
              <div className="p-6 bg-white border-t">
                <div className="flex justify-between items-center mb-6">
                  {!editMode[companyKey] ? (
                    <button
                      onClick={() => setEditMode(prev => ({ ...prev, [companyKey]: true }))}
                      className="bg-amber-500 text-white px-5 py-2.5 rounded-xl text-xs font-black"
                    >EDIT RESULTS</button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`select-all-${companyKey}`}
                        checked={isAllSelected}
                        onChange={() => handleSelectAll(companyKey, filteredApplications)}
                        className="w-5 h-5 accent-indigo-600"
                      />
                      <label htmlFor={`select-all-${companyKey}`} className="text-xs font-black text-gray-600 cursor-pointer">SELECT ALL SEARCHED</label>
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Search student..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerms(prev => ({ ...prev, [companyKey]: e.target.value }))}
                    className="w-72 border p-3 rounded-xl text-sm"
                  />
                </div>

                <div className="overflow-hidden border border-gray-100 rounded-2xl">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black text-gray-400 uppercase bg-gray-50/50">
                        {editMode[companyKey] && <th className="p-4 w-12 text-center">Sel.</th>}
                        <th className="p-4">Student Details</th>
                        <th className="p-4 text-center">Offer Letter</th>
                        <th className="p-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredApplications.map((app) => {
                        const studentId = app.student?.id;
                        const isSelected = selections[companyKey]?.includes(studentId);

                        return (
                          <tr key={app.id} className="hover:bg-indigo-50/30 transition-colors">
                            {editMode[companyKey] && (
                              <td className="p-4 text-center">
                                <input
                                  type="checkbox"
                                  className="w-5 h-5 accent-indigo-600"
                                  checked={!!isSelected}
                                  onChange={() => {
                                    const current = selections[companyKey] || [];
                                    const newSel = current.includes(studentId)
                                      ? current.filter(id => id !== studentId)
                                      : [...current, studentId];
                                    setSelections(prev => ({ ...prev, [companyKey]: newSel }));
                                  }}
                                />
                              </td>
                            )}
                            <td className="p-4">
                              <div className="font-bold text-gray-800 text-sm uppercase">{app.student?.name}</div>
                              <div className="text-[11px] text-gray-400">{app.student?.email}</div>
                            </td>
                            <td className="p-4 text-center">
                              {app.status === "SELECTED" ? (
                                app.offerLetterPath ? (
                                  <a href={`http://localhost:8080/uploads/offer_letters/${app.offerLetterPath}`} target="_blank" rel="noreferrer" className="text-blue-600 text-[10px] font-black uppercase underline decoration-2 underline-offset-4">View Offer</a>
                                ) : (
                                  <span className="text-[9px] text-amber-500 font-bold bg-amber-50 px-2 py-1 rounded">Pending</span>
                                )
                              ) : <span className="text-gray-300">—</span>}
                            </td>
                            <td className="p-4 text-right">
                              <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase ${
                                (editMode[companyKey] ? isSelected : app.status === "SELECTED") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}>
                                {editMode[companyKey] ? (isSelected ? "SELECTED" : "REJECTED") : app.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {editMode[companyKey] && (
                  <button
                    disabled={saving[companyKey]}
                    onClick={() => saveResults(company)}
                    className="w-full mt-6 bg-indigo-600 text-white py-4 rounded-xl font-black shadow-lg disabled:opacity-50"
                  >
                    {saving[companyKey] ? "SAVING..." : "PUBLISH FINAL RESULTS"}
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
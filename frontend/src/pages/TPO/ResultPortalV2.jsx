import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ResultPortalV2 = () => {
  const { jobId } = useParams();

  const [studentList, setStudentList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ Backend base URL
  const API_BASE = "http://localhost:8080/api/v2/applications";

  // 1️⃣ Fetch Applicants from Backend
  useEffect(() => {
    const fetchApplicants = async () => {
      if (!jobId || jobId === "undefined") return;

      try {
        setLoading(true);

        const response = await axios.get(
          `${API_BASE}/job/${jobId}/applicants`
        );

        const data = response.data || [];
        setStudentList(data);

        // ✅ Pre-check students already SELECTED in DB
        const alreadySelected = data
          .filter((app) => app.status === "SELECTED")
          .map((app) => app.student?.id)
          .filter(Boolean);

        setSelectedIds(alreadySelected);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching applicants:", err);
        alert("Failed to load applicants. Check backend is running on port 8080.");
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  // 2️⃣ Search Filter Logic
  const filteredStudents = useMemo(() => {
    return studentList.filter((app) => {
      if (!app.student) return false;

      const name = app.student.name?.toLowerCase() || "";
      const email = app.student.email?.toLowerCase() || "";
      const term = searchTerm.toLowerCase();

      return name.includes(term) || email.includes(term);
    });
  }, [searchTerm, studentList]);

  // 3️⃣ Toggle Checkbox Logic
  const toggleStudent = (id) => {
    if (!id) return;

    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // 4️⃣ Submit to Backend
  const submitData = async () => {
    const confirmMsg = `Confirm results?\n\n${selectedIds.length} will be SELECTED\nOthers will be REJECTED.`;

    if (!window.confirm(confirmMsg)) return;

    const payload = {
      jobId: parseInt(jobId),
      selectedStudentIds: selectedIds,
    };

    try {
      setSaving(true);

      // ✅ Correct backend API
      await axios.post(`${API_BASE}/bulk-update`, payload);

      // ✅ Update UI immediately
      const updatedList = studentList.map((app) => ({
        ...app,
        status: selectedIds.includes(app.student?.id)
          ? "SELECTED"
          : "REJECTED",
      }));

      setStudentList(updatedList);

      alert("Results saved successfully ✅");
      setSaving(false);
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Failed to update results ❌\nCheck backend logs for exact error.");
      setSaving(false);
    }
  };

  // 🔄 Loading UI
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-indigo-600 font-bold">
          Loading Applicant Records...
        </p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-2xl rounded-3xl mt-10 border border-gray-100 mb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">
            Final Selection
          </h2>
          <p className="text-gray-500 mt-1">
            Job ID:{" "}
            <span className="font-mono font-bold text-indigo-600">{jobId}</span>{" "}
            | Checked = Selected, Unchecked = Rejected.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search student..."
            className="w-full border-2 border-gray-100 p-3 px-5 rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden border border-gray-100 rounded-3xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 backdrop-blur-md">
              <th className="p-5 text-gray-600 font-extrabold uppercase text-sm tracking-wider">
                Select
              </th>
              <th className="p-5 text-gray-600 font-extrabold uppercase text-sm tracking-wider">
                Student Details
              </th>
              <th className="p-5 text-gray-600 font-extrabold uppercase text-sm tracking-wider text-center">
                Status Preview
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-indigo-50/30 transition-colors group"
                >
                  <td className="p-5">
                    <input
                      type="checkbox"
                      className="w-6 h-6 rounded-lg accent-indigo-600 cursor-pointer transition-transform group-hover:scale-110"
                      checked={selectedIds.includes(app.student?.id)}
                      onChange={() => toggleStudent(app.student?.id)}
                    />
                  </td>

                  <td className="p-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 text-lg uppercase tracking-wide">
                        {app.student?.name || "N/A"}
                      </span>
                      <span className="text-sm text-gray-400 font-medium italic">
                        {app.student?.email || "N/A"}
                      </span>
                    </div>
                  </td>

                  <td className="p-5 text-center">
                    {selectedIds.includes(app.student?.id) ? (
                      <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-1.5 rounded-xl text-xs font-black ring-1 ring-green-200">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        SELECTED
                      </div>
                    ) : (
                      <div className="inline-flex items-center bg-gray-100 text-gray-400 px-4 py-1.5 rounded-xl text-xs font-black ring-1 ring-gray-200">
                        <span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
                        REJECTED
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="p-10 text-center text-gray-400 font-medium"
                >
                  No applicants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-10 flex flex-col md:flex-row justify-between items-center p-8 bg-indigo-600 rounded-[2rem] shadow-xl shadow-indigo-200 border-4 border-white">
        <div className="text-white mb-6 md:mb-0">
          <p className="text-3xl font-black">{selectedIds.length} Selected</p>
          <p className="text-indigo-100 font-medium">
            Total applicants: {studentList.length}
          </p>
        </div>

        <button
          onClick={submitData}
          disabled={saving}
          className={`bg-white hover:bg-gray-100 text-indigo-600 py-4 px-16 rounded-2xl font-black text-xl shadow-2xl transition-all active:scale-95 hover:-translate-y-1 ${
            saving ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {saving ? "SAVING..." : "SAVE CHANGES"}
        </button>
      </div>
    </div>
  );
};

export default ResultPortalV2;

import React, { useState, useEffect, useMemo } from "react";

const TPONotification = () => {
  const [students, setStudents] = useState([]);

  // backend filtering
  const [filter, setFilter] = useState({
    company: "",
    minCpi: "",
    pref: "PLACEMENT",
  });

  // UI search inside target list
  const [studentSearch, setStudentSearch] = useState("");

  const [formData, setFormData] = useState({
    type: "JOB_DRIVE",
    companyName: "",
    minCpi: "",
    min10thPercent: "",
    min12thPercent: "",
    description: "",
    driveDate: "",
    eligibilityType: "BOTH",

    // ✅ IMPORTANT: PUBLIC / PRIVATE
    mode: "PUBLIC",

    // only used in PRIVATE mode
    targetStudentIds: [],
  });

  const [pdfFile, setPdfFile] = useState(null);

  // =========================
  // 1) Fetch students based on filter
  // =========================
  useEffect(() => {
    const params = new URLSearchParams(filter).toString();

    fetch(`http://localhost:8080/api/notifications/filter-students?${params}`)
      .then((res) => res.json())
      .then((data) => setStudents(data || []))
      .catch((err) => console.error("Fetch error:", err));
  }, [filter]);

  // =========================
  // 2) Filter students by search (UI only)
  // =========================
  const filteredStudents = useMemo(() => {
    const term = studentSearch.trim().toLowerCase();
    if (!term) return students;

    return (students || []).filter((s) => {
      const name = (s.name || "").toLowerCase();
      const email = (s.email || "").toLowerCase();
      return name.includes(term) || email.includes(term);
    });
  }, [students, studentSearch]);

  // =========================
  // 3) When switching to PUBLIC → clear selected IDs
  // =========================
  useEffect(() => {
    if (formData.mode === "PUBLIC") {
      setFormData((prev) => ({
        ...prev,
        targetStudentIds: [],
      }));
    }
  }, [formData.mode]);

  // =========================
  // 4) Submit Notification
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ PRIVATE validation
    if (formData.mode === "PRIVATE" && formData.targetStudentIds.length === 0) {
      alert("Please select at least 1 student for PRIVATE broadcast.");
      return;
    }

    // ✅ PUBLIC broadcast should send empty list
    const finalPayload = {
      ...formData,
      targetStudentIds: formData.mode === "PUBLIC" ? [] : formData.targetStudentIds,
    };

    const data = new FormData();
    data.append("notification", JSON.stringify(finalPayload));
    if (pdfFile) data.append("file", pdfFile);

    try {
      const res = await fetch(
        "http://localhost:8080/api/notifications/create-advanced",
        {
          method: "POST",
          body: data,
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        alert("❌ Failed: " + errText);
        return;
      }

      alert("✅ Notification broadcasted successfully!");

      // reset (optional)
      setFormData((prev) => ({
        ...prev,
        companyName: "",
        description: "",
        minCpi: "",
        min10thPercent: "",
        min12thPercent: "",
        targetStudentIds: [],
        mode: "PUBLIC",
      }));

      setPdfFile(null);
      setStudentSearch("");
    } catch (err) {
      console.error(err);
      alert("❌ Server error. Check backend.");
    }
  };

  // =========================
  // 5) Toggle Student checkbox
  // =========================
  const toggleStudent = (id) => {
    if (!id) return;

    setFormData((prev) => {
      const exists = prev.targetStudentIds.includes(id);
      return {
        ...prev,
        targetStudentIds: exists
          ? prev.targetStudentIds.filter((x) => x !== id)
          : [...prev.targetStudentIds, id],
      };
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* ================= LEFT PANEL ================= */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
        <h2 className="text-2xl font-bold mb-6">Create Notification</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type + Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="p-3 border rounded-xl"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              <option value="JOB_DRIVE">Job Drive</option>
              <option value="GENERAL_NOTICE">General Notice</option>
            </select>

            {formData.type === "JOB_DRIVE" && (
              <input
                type="text"
                placeholder="Company Name"
                className="p-3 border rounded-xl"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                required
              />
            )}
          </div>

          {/* Message */}
          <textarea
            placeholder="Message"
            className="w-full p-3 border rounded-xl"
            rows="5"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />

          {/* Criteria */}
          <div className="p-4 bg-gray-50 rounded-2xl grid grid-cols-3 gap-4">
            <input
              type="number"
              placeholder="Min CPI"
              className="p-3 border rounded-xl bg-white"
              value={formData.minCpi}
              onChange={(e) =>
                setFormData({ ...formData, minCpi: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="10th %"
              className="p-3 border rounded-xl bg-white"
              value={formData.min10thPercent}
              onChange={(e) =>
                setFormData({ ...formData, min10thPercent: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="12th %"
              className="p-3 border rounded-xl bg-white"
              value={formData.min12thPercent}
              onChange={(e) =>
                setFormData({ ...formData, min12thPercent: e.target.value })
              }
            />
          </div>

          {/* PDF */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">
              Attachment (Optional PDF)
            </label>
            <input
              type="file"
              accept=".pdf"
              className="w-full p-2 border rounded-xl"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            />
          </div>

          {/* ✅ PUBLIC / PRIVATE RADIO */}
          <div className="p-4 border rounded-2xl bg-gray-50 flex gap-8 items-center justify-center">
            <label className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer">
              <input
                type="radio"
                name="mode"
                value="PUBLIC"
                checked={formData.mode === "PUBLIC"}
                onChange={() => setFormData({ ...formData, mode: "PUBLIC" })}
              />
              Public (All Students)
            </label>

            <label className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer">
              <input
                type="radio"
                name="mode"
                value="PRIVATE"
                checked={formData.mode === "PRIVATE"}
                onChange={() => setFormData({ ...formData, mode: "PRIVATE" })}
              />
              Private (Selected Students)
            </label>
          </div>

          {/* Submit */}
          <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-lg hover:bg-indigo-700 transition-all active:scale-95">
            BROADCAST
          </button>
        </form>
      </div>

      {/* ================= RIGHT PANEL (Target Students) ================= */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border h-fit">
        <h3 className="font-black mb-2">Target Students</h3>

        {/* If Public */}
        {formData.mode === "PUBLIC" ? (
          <div className="p-4 mt-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
            <p className="font-bold text-indigo-700">
              Public Broadcast Enabled ✅
            </p>
            <p className="text-sm text-indigo-500 mt-1">
              This notification will go to <b>all students</b>.
            </p>
          </div>
        ) : (
          <>
            {/* Filter inputs (backend filter) */}
            <div className="space-y-2 mt-4">
              <input
                type="text"
                placeholder="Filter by Company (backend)"
                className="w-full p-2 border rounded-xl text-sm"
                value={filter.company}
                onChange={(e) =>
                  setFilter({ ...filter, company: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Min CPI (backend)"
                className="w-full p-2 border rounded-xl text-sm"
                value={filter.minCpi}
                onChange={(e) =>
                  setFilter({ ...filter, minCpi: e.target.value })
                }
              />

              {/* ✅ Student Search (UI only) */}
              <input
                type="text"
                placeholder="Search student name..."
                className="w-full p-2 border rounded-xl text-sm"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
              />
            </div>

            {/* Selected Count */}
            <div className="mt-4 text-xs font-bold text-gray-500">
              Selected:{" "}
              <span className="text-indigo-600">
                {formData.targetStudentIds.length}
              </span>
            </div>

            {/* Student List */}
            <div className="mt-3 max-h-[420px] overflow-y-auto border rounded-2xl">
              {filteredStudents.length === 0 ? (
                <p className="text-gray-400 text-xs p-8 text-center italic">
                  No students found
                </p>
              ) : (
                filteredStudents.map((s) => (
                  <label
                    key={s.id}
                    className="flex justify-between items-center p-3 border-b hover:bg-indigo-50 transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-800">
                        {s.name}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        CPI: {s.cpi}
                      </span>
                    </div>

                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-indigo-600 rounded"
                      checked={formData.targetStudentIds.includes(s.id)}
                      onChange={() => toggleStudent(s.id)}
                    />
                  </label>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TPONotification;

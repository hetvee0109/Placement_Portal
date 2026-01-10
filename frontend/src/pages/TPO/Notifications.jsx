import React, { useState, useEffect } from "react";

const TPONotification = () => {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState({ company: "", minCpi: "", pref: "PLACEMENT" });
  const [formData, setFormData] = useState({
    type: "JOB_DRIVE", companyName: "", minCpi: "", description: "",
    driveDate: "", eligibilityType: "PLACEMENT", mode: "PUBLIC", targetStudentIds: []
  });
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(filter).toString();
    fetch(`http://localhost:8080/api/notifications/filter-students?${params}`)
      .then(res => res.json())
      .then(data => setStudents(data));
  }, [filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("notification", JSON.stringify(formData));
    if (pdfFile) data.append("file", pdfFile);

    const res = await fetch("http://localhost:8080/api/notifications/create-advanced", {
      method: "POST",
      body: data
    });
    if (res.ok) alert("The message has been sent successfully.");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
        <h2 className="text-2xl font-bold mb-6">Create Notification</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            className="w-full p-2 border rounded"
            value={formData.type}
            onChange={e => setFormData({...formData, type: e.target.value})}
          >
            <option value="JOB_DRIVE">Job Drive</option>
            <option value="GENERAL_NOTICE">General Information/Notice</option>
          </select>

          {/* Conditional Rendering: Only show Company Name if it's a Job Drive */}
          {formData.type === "JOB_DRIVE" && (
            <input
              type="text"
              placeholder="Company Name"
              className="w-full p-2 border rounded"
              value={formData.companyName}
              onChange={e => setFormData({...formData, companyName: e.target.value})}
              required
            />
          )}

          <textarea
            placeholder="Description/Message"
            className="w-full p-2 border rounded"
            rows="4"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Conditional Rendering: Only show Min CPI if it's a Job Drive */}
            {formData.type === "JOB_DRIVE" ? (
              <input
                type="number"
                placeholder="Min CPI"
                className="p-2 border rounded"
                value={formData.minCpi}
                onChange={e => setFormData({...formData, minCpi: e.target.value})}
              />
            ) : (
              <div className="flex items-center text-gray-400 text-sm italic italic">
                Criteria not required for General Notice
              </div>
            )}
            <input type="file" accept=".pdf" className="p-2 border rounded" onChange={e => setPdfFile(e.target.files[0])}/>
          </div>

          <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
             <label className="flex items-center gap-2 cursor-pointer">
               <input type="radio" name="mode" checked={formData.mode === "PUBLIC"} onChange={() => setFormData({...formData, mode: "PUBLIC"})}/>
               Public (All Students)
             </label>
             <label className="flex items-center gap-2 cursor-pointer">
               <input type="radio" name="mode" checked={formData.mode === "PRIVATE"} onChange={() => setFormData({...formData, mode: "PRIVATE"})}/>
               Private (Selected Students)
             </label>
          </div>
          <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
            Broadcast {formData.type === "JOB_DRIVE" ? "Job Drive" : "Notice"}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h3 className="font-bold mb-4">Target Student Filter</h3>
        <input type="text" placeholder="Filter by Applied Company" className="w-full p-2 border rounded mb-2 text-sm" onChange={e => setFilter({...filter, company: e.target.value})}/>
        <input type="number" placeholder="Filter by CPI" className="w-full p-2 border rounded mb-2 text-sm" onChange={e => setFilter({...filter, minCpi: e.target.value})}/>

        <div className="mt-4 max-h-96 overflow-y-auto border-t">
          {students.length === 0 ? (
            <p className="text-gray-400 text-xs p-4 text-center">No students match current filters</p>
          ) : (
            students.map(s => (
              <label key={s.id} className="flex justify-between items-center p-3 border-b hover:bg-gray-50 cursor-pointer">
                <span className="text-sm font-medium">{s.name} <span className="text-gray-400">({s.cpi})</span></span>
                <input type="checkbox" className="w-4 h-4" checked={formData.targetStudentIds.includes(s.id)}
                  onChange={() => {
                     const ids = formData.targetStudentIds.includes(s.id) ? formData.targetStudentIds.filter(id => id !== s.id) : [...formData.targetStudentIds, s.id];
                     setFormData({...formData, targetStudentIds: ids});
                  }}/>
              </label>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default TPONotification;
// import React, { useState, useEffect } from "react";
//
// const TPONotification = () => {
//   const [students, setStudents] = useState([]);
//   const [formData, setFormData] = useState({
//     companyName: "",
//     minCpi: "",
//     description: "",
//     driveDate: "",
//     eligibilityType: "PLACEMENT",
//     mode: "PUBLIC",
//     targetStudentIds: []
//   });
//
//   useEffect(() => {
//     fetch("http://localhost:8080/api/students?role=TPO") // Fetching students for Private mode selection
//       .then(res => res.json())
//       .then(data => setStudents(data))
//       .catch(err => console.error("Error fetching students:", err));
//   }, []);
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("http://localhost:8080/api/notifications/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData)
//       });
//       if (response.ok) {
//         alert("Notification Broadcasted Successfully!");
//         setFormData({ companyName: "", minCpi: "", description: "", driveDate: "", eligibilityType: "PLACEMENT", mode: "PUBLIC", targetStudentIds: [] });
//       }
//     } catch (error) {
//       alert("Error sending notification");
//     }
//   };
//
//   const handleStudentSelect = (id) => {
//     const updatedIds = formData.targetStudentIds.includes(id)
//       ? formData.targetStudentIds.filter(sid => sid !== id)
//       : [...formData.targetStudentIds, id];
//     setFormData({ ...formData, targetStudentIds: updatedIds });
//   };
//
//   return (
//     <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-10 border border-gray-100">
//       <h2 className="text-3xl font-black text-indigo-700 mb-6 flex items-center gap-2">
//         📢 Create New Drive Notification
//       </h2>
//       <form onSubmit={handleSubmit} className="space-y-5">
//         <div className="grid grid-cols-2 gap-4">
//           <input type="text" placeholder="Company Name" className="p-3 border rounded-lg outline-indigo-500"
//             value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} required />
//           <input type="number" step="0.01" placeholder="Min CPI Criteria" className="p-3 border rounded-lg outline-indigo-500"
//             value={formData.minCpi} onChange={e => setFormData({...formData, minCpi: e.target.value})} required />
//         </div>
//
//         <textarea placeholder="Job Description" className="w-full p-3 border rounded-lg outline-indigo-500" rows="3"
//           value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
//
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="text-xs font-bold text-gray-500 uppercase">Drive Date</label>
//             <input type="datetime-local" className="w-full p-3 border rounded-lg outline-indigo-500"
//               value={formData.driveDate} onChange={e => setFormData({...formData, driveDate: e.target.value})} required />
//           </div>
//           <div>
//             <label className="text-xs font-bold text-gray-500 uppercase">Eligibility Group</label>
//             <select className="w-full p-3 border rounded-lg" value={formData.eligibilityType}
//               onChange={e => setFormData({...formData, eligibilityType: e.target.value})}>
//               <option value="PLACEMENT">Placement</option>
//               <option value="HIGHER_STUDIES">Higher Studies</option>
//             </select>
//           </div>
//         </div>
//
//         <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
//           <label className="block font-bold text-gray-700 mb-2">Broadcast Mode</label>
//           <div className="flex gap-6 mb-4">
//             <label className="flex items-center gap-2"><input type="radio" name="mode" value="PUBLIC" checked={formData.mode === 'PUBLIC'} onChange={() => setFormData({...formData, mode: 'PUBLIC'})}/> Public (All Eligible)</label>
//             <label className="flex items-center gap-2"><input type="radio" name="mode" value="PRIVATE" checked={formData.mode === 'PRIVATE'} onChange={() => setFormData({...formData, mode: 'PRIVATE'})}/> Private (Specific Students)</label>
//           </div>
//
//           {formData.mode === 'PRIVATE' && (
//             <div className="max-h-40 overflow-y-auto border p-2 rounded bg-white">
//               {students.map(s => (
//                 <label key={s.id} className="flex items-center gap-2 p-1 hover:bg-indigo-50 rounded">
//                   <input type="checkbox" checked={formData.targetStudentIds.includes(s.id)} onChange={() => handleStudentSelect(s.id)} />
//                   <span className="text-sm">{s.name} (CPI: {s.cpi})</span>
//                 </label>
//               ))}
//             </div>
//           )}
//         </div>
//
//         <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg">
//           Broadcast Notification
//         </button>
//       </form>
//     </div>
//   );
// };
//
// export default TPONotification;

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
    if (res.ok) alert("Sent successfully!");
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
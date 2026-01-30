// import React, { useState, useEffect } from "react";
//
// const TPONotification = () => {
//   const [students, setStudents] = useState([]);
//   const [filter, setFilter] = useState({ company: "", minCpi: "", pref: "PLACEMENT" });
//   const [formData, setFormData] = useState({
//     type: "JOB_DRIVE", companyName: "", minCpi: "", description: "",
//     driveDate: "", eligibilityType: "PLACEMENT", mode: "PUBLIC", targetStudentIds: []
//   });
//   const [pdfFile, setPdfFile] = useState(null);
//
//   useEffect(() => {
//     const params = new URLSearchParams(filter).toString();
//     fetch(`http://localhost:8080/api/notifications/filter-students?${params}`)
//       .then(res => res.json())
//       .then(data => setStudents(data));
//   }, [filter]);
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const data = new FormData();
//     data.append("notification", JSON.stringify(formData));
//     if (pdfFile) data.append("file", pdfFile);
//
//     const res = await fetch("http://localhost:8080/api/notifications/create-advanced", {
//       method: "POST",
//       body: data
//     });
//     if (res.ok) alert("The message has been sent successfully.");
//   };
//
//   return (
//     <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
//       <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
//         <h2 className="text-2xl font-bold mb-6">Create Notification</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <select
//             className="w-full p-2 border rounded"
//             value={formData.type}
//             onChange={e => setFormData({...formData, type: e.target.value})}
//           >
//             <option value="JOB_DRIVE">Job Drive</option>
//             <option value="GENERAL_NOTICE">General Information/Notice</option>
//           </select>
//
//           {/* Conditional Rendering: Only show Company Name if it's a Job Drive */}
//           {formData.type === "JOB_DRIVE" && (
//             <input
//               type="text"
//               placeholder="Company Name"
//               className="w-full p-2 border rounded"
//               value={formData.companyName}
//               onChange={e => setFormData({...formData, companyName: e.target.value})}
//               required
//             />
//           )}
//
//           <textarea
//             placeholder="Description/Message"
//             className="w-full p-2 border rounded"
//             rows="4"
//             value={formData.description}
//             onChange={e => setFormData({...formData, description: e.target.value})}
//             required
//           />
//
//           <div className="grid grid-cols-2 gap-4">
//             {/* Conditional Rendering: Only show Min CPI if it's a Job Drive */}
//             {formData.type === "JOB_DRIVE" ? (
//               <input
//                 type="number"
//                 placeholder="Min CPI"
//                 className="p-2 border rounded"
//                 value={formData.minCpi}
//                 onChange={e => setFormData({...formData, minCpi: e.target.value})}
//               />
//             ) : (
//               <div className="flex items-center text-gray-400 text-sm italic italic">
//                 Criteria not required for General Notice
//               </div>
//             )}
//             <input type="file" accept=".pdf" className="p-2 border rounded" onChange={e => setPdfFile(e.target.files[0])}/>
//           </div>
//
//           <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
//              <label className="flex items-center gap-2 cursor-pointer">
//                <input type="radio" name="mode" checked={formData.mode === "PUBLIC"} onChange={() => setFormData({...formData, mode: "PUBLIC"})}/>
//                Public (All Students)
//              </label>
//              <label className="flex items-center gap-2 cursor-pointer">
//                <input type="radio" name="mode" checked={formData.mode === "PRIVATE"} onChange={() => setFormData({...formData, mode: "PRIVATE"})}/>
//                Private (Selected Students)
//              </label>
//           </div>
//           <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
//             Broadcast {formData.type === "JOB_DRIVE" ? "Job Drive" : "Notice"}
//           </button>
//         </form>
//       </div>
//
//       <div className="bg-white p-6 rounded-2xl shadow-sm border">
//         <h3 className="font-bold mb-4">Target Student Filter</h3>
//         <input type="text" placeholder="Filter by Applied Company" className="w-full p-2 border rounded mb-2 text-sm" onChange={e => setFilter({...filter, company: e.target.value})}/>
//         <input type="number" placeholder="Filter by CPI" className="w-full p-2 border rounded mb-2 text-sm" onChange={e => setFilter({...filter, minCpi: e.target.value})}/>
//
//         <div className="mt-4 max-h-96 overflow-y-auto border-t">
//           {students.length === 0 ? (
//             <p className="text-gray-400 text-xs p-4 text-center">No students match current filters</p>
//           ) : (
//             students.map(s => (
//               <label key={s.id} className="flex justify-between items-center p-3 border-b hover:bg-gray-50 cursor-pointer">
//                 <span className="text-sm font-medium">{s.name} <span className="text-gray-400">({s.cpi})</span></span>
//                 <input type="checkbox" className="w-4 h-4" checked={formData.targetStudentIds.includes(s.id)}
//                   onChange={() => {
//                      const ids = formData.targetStudentIds.includes(s.id) ? formData.targetStudentIds.filter(id => id !== s.id) : [...formData.targetStudentIds, s.id];
//                      setFormData({...formData, targetStudentIds: ids});
//                   }}/>
//               </label>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
// export default TPONotification;


import React, { useState, useEffect } from "react";

const TPONotification = () => {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState({ company: "", minCpi: "", pref: "PLACEMENT" });
  const [formData, setFormData] = useState({
    type: "JOB_DRIVE",
    companyName: "",
    minCpi: "",
    min10thPercent: "", // New Field
    min12thPercent: "", // New Field
    description: "",
    driveDate: "",
    eligibilityType: "BOTH", // Defaulted to BOTH as requested
    mode: "PUBLIC",
    targetStudentIds: []
  });
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(filter).toString();
    fetch(`http://localhost:8081/api/notifications/filter-students?${params}`)
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
    if (res.ok) {
        alert("The notification has been broadcasted successfully.");
        // Optional: Reset form or redirect
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Notification</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
                className="p-2 border rounded-lg bg-gray-50 font-semibold"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
            >
                <option value="JOB_DRIVE">Job Drive</option>
                <option value="GENERAL_NOTICE">General Information/Notice</option>
            </select>

            {formData.type === "JOB_DRIVE" && (
                <input
                type="text"
                placeholder="Company Name"
                className="p-2 border rounded-lg"
                value={formData.companyName}
                onChange={e => setFormData({...formData, companyName: e.target.value})}
                required
                />
            )}
          </div>

          <textarea
            placeholder="Description/Message"
            className="w-full p-2 border rounded-lg"
            rows="4"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            required
          />

          {/* Academic Criteria Section */}
          <div className="p-4 bg-gray-50 rounded-xl space-y-3">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Academic Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                    type="number" step="0.01" placeholder="Min CPI"
                    className="p-2 border rounded-lg bg-white"
                    value={formData.minCpi}
                    onChange={e => setFormData({...formData, minCpi: e.target.value})}
                />
                <input
                    type="number" step="0.01" placeholder="Min 10th %"
                    className="p-2 border rounded-lg bg-white"
                    value={formData.min10thPercent}
                    onChange={e => setFormData({...formData, min10thPercent: e.target.value})}
                />
                <input
                    type="number" step="0.01" placeholder="Min 12th %"
                    className="p-2 border rounded-lg bg-white"
                    value={formData.min12thPercent}
                    onChange={e => setFormData({...formData, min12thPercent: e.target.value})}
                />
            </div>
          </div>

          {/* Career Path Selection - NEW */}
          <div className="p-4 border border-indigo-100 rounded-xl space-y-3">
            <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Eligible Career Preference</h3>
            <div className="flex flex-wrap gap-6">
                {["CAMPUS PLACEMENT", "HIGHER STUDIES", "BOTH"].map((opt) => {
                    const value = opt === "CAMPUS PLACEMENT" ? "PLACEMENT" : opt === "HIGHER STUDIES" ? "HIGHER_STUDIES" : "BOTH";
                    return (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                            <input
                                type="radio"
                                name="eligibilityType"
                                checked={formData.eligibilityType === value}
                                onChange={() => setFormData({...formData, eligibilityType: value})}
                                className="w-4 h-4 accent-indigo-600"
                            />
                            {opt}
                        </label>
                    );
                })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="flex flex-col">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">Attachment (Optional PDF)</label>
                <input type="file" accept=".pdf" className="p-1 border rounded-lg text-sm" onChange={e => setPdfFile(e.target.files[0])}/>
            </div>

            <div className="flex gap-4 p-2 bg-gray-100 rounded-lg justify-around">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-bold">
                <input type="radio" name="mode" checked={formData.mode === "PUBLIC"} onChange={() => setFormData({...formData, mode: "PUBLIC"})}/>
                Public
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-bold">
                <input type="radio" name="mode" checked={formData.mode === "PRIVATE"} onChange={() => setFormData({...formData, mode: "PRIVATE"})}/>
                Private
                </label>
            </div>
          </div>

          <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-lg shadow-indigo-200 shadow-lg hover:bg-indigo-700 transition-all active:scale-95">
            BROADCAST {formData.type === "JOB_DRIVE" ? "DRIVE" : "NOTICE"}
          </button>
        </form>
      </div>

      {/* Sidebar Filter for Private Mode */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border h-fit sticky top-6">
        <h3 className="font-bold mb-4 text-gray-800">Target Student Filter (Private)</h3>
        <div className="space-y-2">
            <input type="text" placeholder="Filter by Company" className="w-full p-2 border rounded-lg text-sm" onChange={e => setFilter({...filter, company: e.target.value})}/>
            <input type="number" placeholder="Min CPI" className="w-full p-2 border rounded-lg text-sm" onChange={e => setFilter({...filter, minCpi: e.target.value})}/>
        </div>

        <div className="mt-6 max-h-[400px] overflow-y-auto border-t">
          {students.length === 0 ? (
            <p className="text-gray-400 text-xs p-8 text-center italic">No students found matching filters</p>
          ) : (
            students.map(s => (
              <label key={s.id} className="flex justify-between items-center p-3 border-b hover:bg-indigo-50 transition-colors cursor-pointer">
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-700">{s.name}</span>
                    <span className="text-[10px] text-gray-500 font-mono">CPI: {s.cpi}</span>
                </div>
                <input type="checkbox" className="w-5 h-5 accent-indigo-600 rounded" checked={formData.targetStudentIds.includes(s.id)}
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
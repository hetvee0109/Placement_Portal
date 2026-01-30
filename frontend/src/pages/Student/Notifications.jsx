 // import React, { useEffect, useState, useCallback } from "react";
//
// const StudentNotification = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [user, setUser] = useState(null);
//   const [profile, setProfile] = useState(null);
//   const [isPlaced, setIsPlaced] = useState(false);
//   const [loading, setLoading] = useState(true);
//
//   // 1. Fetch All Necessary Data
//   const fetchData = useCallback(async () => {
//     const email = localStorage.getItem("userEmail");
//     if (!email) return;
//
//     try {
//       // Get User basic info (contains CPI)
//       const userRes = await fetch(`http://localhost:8080/api/auth/get-user?email=${email}`);
//       const userData = await userRes.json();
//       setUser(userData);
//
//       // Get Profile info (contains 10th/12th % and Career Preference)
//       const profileRes = await fetch(`http://localhost:8080/api/students/profile/${userData.id}`);
//       if (profileRes.ok) {
//         const profileData = await profileRes.json();
//         setProfile(profileData);
//       }
//
//       // Check if already placed
//       const appRes = await fetch(`http://localhost:8080/api/job-applications/student/${userData.id}`);
//       if (appRes.ok) {
//         const apps = await appRes.json();
//         setIsPlaced(apps.some(app => app.status === "SELECTED"));
//       }
//
//       // Fetch Notifications tailored for this student
//       const noteRes = await fetch(`http://localhost:8080/api/notifications/student/${userData.id}`);
//       const data = await noteRes.json();
//       setNotifications(data);
//
//     } catch (err) {
//       console.error("Error loading dashboard:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);
//
//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);
//
//   // 2. Handle Application Logic
//   const handleApply = async (noteId) => {
//     if (!user || isPlaced) return;
//
//     try {
//       const res = await fetch(
//         `http://localhost:8080/api/notifications/apply?studentId=${user.id}&noteId=${noteId}`,
//         { method: "POST" }
//       );
//
//       const data = await res.json();
//
//       if (data.status === "SUCCESS") {
//         alert("Applied successfully!");
//         fetchData(); // Refresh to update button states
//       } else {
//         // Map backend codes to friendly messages
//         const errorMessages = {
//           "PROFILE_INCOMPLETE": "Please update your 10th/12th percentages in your profile.",
//           "INELIGIBLE_CPI": "Your CPI does not meet the minimum requirement.",
//           "INELIGIBLE_10TH": "Your 10th percentage does not meet the requirement.",
//           "INELIGIBLE_12TH": "Your 12th percentage does not meet the requirement.",
//           "ALREADY_APPLIED": "You have already applied to this drive."
//         };
//         alert(errorMessages[data.status] || "Application failed: " + data.status);
//       }
//     } catch (err) {
//       alert("Server error. Please check if the backend is running.");
//     }
//   };
//
//   // 3. Toggle Star/Save Logic
//   const handleToggleStar = async (id) => {
//     if (!user) return;
//
//     // Optimistic UI Update
//     setNotifications(prev =>
//       prev.map(n => n.id === id ? {
//         ...n,
//         starredByStudentIds: n.starredByStudentIds.includes(user.id)
//           ? n.starredByStudentIds.filter(sid => sid !== user.id)
//           : [...n.starredByStudentIds, user.id]
//       } : n)
//     );
//
//     await fetch(`http://localhost:8081/api/notifications/star?studentId=${user.id}&noteId=${id}`, { method: "POST" });
//   };
//
//   if (loading) return <div className="flex justify-center mt-20 font-bold text-indigo-600 animate-pulse">Synchronizing Dashboard...</div>;
//
//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-3xl font-black text-slate-800">Placement Portal</h1>
//           <p className="text-slate-500 font-medium">
//             Preference: <span className="text-indigo-600 font-bold">{profile?.careerPreference || "Not Set"}</span>
//           </p>
//         </div>
//         {isPlaced && (
//           <div className="bg-green-100 text-green-700 px-6 py-3 rounded-2xl font-black text-sm border-2 border-green-200 shadow-sm">
//             🎉 CONGRATULATIONS! YOU ARE PLACED
//           </div>
//         )}
//       </div>
//
//       {/* Notifications Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {notifications.map(note => {
//           // --- Eligibility Calculation ---
//           const isStarred = note.starredByStudentIds?.includes(user?.id);
//           const hasFullProfile = profile?.tenthPercentage && profile?.twelfthPercentage;
//
//           // Logic: Drive matches if it's 'BOTH' or matches student's specific preference
//           const pathMatches = note.eligibilityType === "BOTH" || note.eligibilityType === profile?.careerPreference;
//
//           const cpiOk = (user?.cpi || 0) >= (note.minCpi || 0);
//           const tenthOk = (profile?.tenthPercentage || 0) >= (note.min10thPercent || 0);
//           const twelfthOk = (profile?.twelfthPercentage || 0) >= (note.min12thPercent || 0);
//
//           const isEligible = cpiOk && tenthOk && twelfthOk;
//
//           // If career path doesn't match, we hide the drive (only for job drives)
//           if (note.type === "JOB_DRIVE" && !pathMatches) return null;
//
//           return (
//             <div key={note.id} className={`relative bg-white p-8 rounded-[2rem] border-2 transition-all duration-300 ${!isEligible ? 'border-gray-100 opacity-80' : 'border-white shadow-xl hover:translate-y-[-5px]'}`}>
//
//               {/* Star Button */}
//               <button
//                 onClick={() => handleToggleStar(note.id)}
//                 className={`absolute top-6 right-6 text-2xl transition-transform active:scale-150 ${isStarred ? 'text-amber-400' : 'text-slate-200'}`}
//               >
//                 {isStarred ? "★" : "☆"}
//               </button>
//
//               <div className="mb-6">
//                 <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${note.type === 'JOB_DRIVE' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
//                   {note.type === 'JOB_DRIVE' ? `DRIVE • ${note.eligibilityType}` : 'ANNOUNCEMENT'}
//                 </span>
//                 <h3 className="text-2xl font-black text-slate-800 mt-4 leading-tight">
//                   {note.type === "JOB_DRIVE" ? note.companyName : "General Notice"}
//                 </h3>
//               </div>
//
//               <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
//                 {note.description}
//               </p>
//
//               {note.type === "JOB_DRIVE" && (
//                 <div className="space-y-4 pt-6 border-t border-slate-50">
//                   {/* Eligibility Tags */}
//                   <div className="flex flex-wrap gap-2">
//                     <Tag label="CPI" value={note.minCpi} status={cpiOk} />
//                     <Tag label="10th %" value={note.min10thPercent} status={tenthOk} />
//                     <Tag label="12th %" value={note.min12thPercent} status={twelfthOk} />
//                   </div>
//
//                   {/* Apply Action */}
//                   {!hasFullProfile ? (
//                     <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold text-center border border-red-100">
//                       ⚠️ Update your academic profile to enable application.
//                     </div>
//                   ) : isPlaced ? (
//                     <div className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl font-bold text-center text-sm border border-dashed">
//                       Placement Policy: One Job Per Student
//                     </div>
//                   ) : (
//                     <button
//                       disabled={!isEligible}
//                       onClick={() => handleApply(note.id)}
//                       className={`w-full py-4 rounded-2xl font-black transition-all shadow-lg ${
//                         isEligible
//                           ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200"
//                           : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
//                       }`}
//                     >
//                       {isEligible ? "APPLY FOR DRIVE" : "CRITERIA NOT MET"}
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };
//
// // Helper component for Eligibility Tags
// const Tag = ({ label, value, status }) => (
//   <div className={`flex flex-col px-4 py-2 rounded-xl border ${status ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
//     <span className="text-[9px] uppercase font-bold text-slate-400">{label}</span>
//     <span className={`text-sm font-black ${status ? 'text-green-700' : 'text-red-700'}`}>{value}</span>
//   </div>
// );
//
// export default StudentNotification;



import React, { useEffect, useState, useCallback } from "react";

const StudentNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isPlaced, setIsPlaced] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    try {
      const userRes = await fetch(`http://localhost:8080/api/auth/get-user?email=${email}`);
      const userData = await userRes.json();
      setUser(userData);

      const profileRes = await fetch(`http://localhost:8080/api/students/profile/${userData.id}`);
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
      }

      const appRes = await fetch(`http://localhost:8080/api/job-applications/student/${userData.id}`);
      if (appRes.ok) {
        const apps = await appRes.json();
        setIsPlaced(apps.some(app => app.status === "SELECTED"));
      }

      const noteRes = await fetch(`http://localhost:8080/api/notifications/student/${userData.id}`);
      const data = await noteRes.json();
      setNotifications(data);

    } catch (err) {
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApply = async (noteId) => {
    if (!user || isPlaced) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/notifications/apply?studentId=${user.id}&noteId=${noteId}`,
        { method: "POST" }
      );

      const data = await res.json();

      if (data.status === "SUCCESS") {
        alert("Applied successfully!");
        fetchData();
      } else {
        const errorMessages = {
          "PROFILE_INCOMPLETE": "Please update your 10th/12th percentages in your profile.",
          "INELIGIBLE_CPI": "Your CPI does not meet the minimum requirement.",
          "INELIGIBLE_10TH": "Your 10th percentage does not meet the requirement.",
          "INELIGIBLE_12TH": "Your 12th percentage does not meet the requirement.",
          "ALREADY_APPLIED": "You have already applied to this drive."
        };
        alert(errorMessages[data.status] || "Application failed: " + data.status);
      }
    } catch (err) {
      alert("Server error. Please check if the backend is running.");
    }
  };

  const handleToggleStar = async (id) => {
    if (!user) return;

    setNotifications(prev =>
      prev.map(n => n.id === id ? {
        ...n,
        starredByStudentIds: n.starredByStudentIds.includes(user.id)
          ? n.starredByStudentIds.filter(sid => sid !== user.id)
          : [...n.starredByStudentIds, user.id]
      } : n)
    );

    // Fixed port to 8080 to match other requests
    await fetch(`http://localhost:8080/api/notifications/star?studentId=${user.id}&noteId=${id}`, { method: "POST" });
  };

  if (loading) return <div className="flex justify-center mt-20 font-bold text-indigo-600 animate-pulse">Synchronizing Dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Placement Portal</h1>
          <p className="text-slate-500 font-medium">
            Preference: <span className="text-indigo-600 font-bold">{profile?.careerPreference || "Not Set"}</span>
          </p>
        </div>
        {isPlaced && (
          <div className="bg-green-100 text-green-700 px-6 py-3 rounded-2xl font-black text-sm border-2 border-green-200 shadow-sm">
            🎉 CONGRATULATIONS! YOU ARE PLACED
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {notifications.map(note => {
          const isStarred = note.starredByStudentIds?.includes(user?.id);
          const hasFullProfile = profile?.tenthPercentage && profile?.twelfthPercentage;
          const pathMatches = note.eligibilityType === "BOTH" || note.eligibilityType === profile?.careerPreference;

          const cpiOk = (user?.cpi || 0) >= (note.minCpi || 0);
          const tenthOk = (profile?.tenthPercentage || 0) >= (note.min10thPercent || 0);
          const twelfthOk = (profile?.twelfthPercentage || 0) >= (note.min12thPercent || 0);

          const isEligible = cpiOk && tenthOk && twelfthOk;

          if (note.type === "JOB_DRIVE" && !pathMatches) return null;

          return (
            <div key={note.id} className={`relative bg-white p-8 rounded-[2rem] border-2 transition-all duration-300 ${!isEligible ? 'border-gray-100 opacity-80' : 'border-white shadow-xl hover:translate-y-[-5px]'}`}>

              <button
                onClick={() => handleToggleStar(note.id)}
                className={`absolute top-6 right-6 text-2xl transition-transform active:scale-150 ${isStarred ? 'text-amber-400' : 'text-slate-200'}`}
              >
                {isStarred ? "★" : "☆"}
              </button>

              <div className="mb-6">
                <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${note.type === 'JOB_DRIVE' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {note.type === 'JOB_DRIVE' ? `DRIVE • ${note.eligibilityType}` : 'ANNOUNCEMENT'}
                </span>
                <h3 className="text-2xl font-black text-slate-800 mt-4 leading-tight">
                  {note.type === "JOB_DRIVE" ? note.companyName : "General Notice"}
                </h3>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                {note.description}
              </p>

              {/* PDF ATTACHMENT SECTION - NEWLY ADDED */}
              {note.pdfPath && (
                <div className="mb-6">
                  <a
                    href={`http://localhost:8080/api/notifications/files/${note.pdfPath.split('\\').pop().split('/').pop()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-indigo-600 font-bold text-xs hover:bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    VIEW ATTACHED PDF
                  </a>
                </div>
              )}

              {note.type === "JOB_DRIVE" && (
                <div className="space-y-4 pt-6 border-t border-slate-50">
                  <div className="flex flex-wrap gap-2">
                    <Tag label="CPI" value={note.minCpi} status={cpiOk} />
                    <Tag label="10th %" value={note.min10thPercent} status={tenthOk} />
                    <Tag label="12th %" value={note.min12thPercent} status={twelfthOk} />
                  </div>

                  {!hasFullProfile ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold text-center border border-red-100">
                      ⚠️ Update your academic profile to enable application.
                    </div>
                  ) : isPlaced ? (
                    <div className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl font-bold text-center text-sm border border-dashed">
                      Placement Policy: One Job Per Student
                    </div>
                  ) : (
                    <button
                      disabled={!isEligible}
                      onClick={() => handleApply(note.id)}
                      className={`w-full py-4 rounded-2xl font-black transition-all shadow-lg ${
                        isEligible
                          ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                      }`}
                    >
                      {isEligible ? "APPLY FOR DRIVE" : "CRITERIA NOT MET"}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Tag = ({ label, value, status }) => (
  <div className={`flex flex-col px-4 py-2 rounded-xl border ${status ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
    <span className="text-[9px] uppercase font-bold text-slate-400">{label}</span>
    <span className={`text-sm font-black ${status ? 'text-green-700' : 'text-red-700'}`}>{value}</span>
  </div>
);

export default StudentNotification;
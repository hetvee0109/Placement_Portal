import React, { useEffect, useState } from "react";

const StudentNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);

  // added it now
  const handleApply = async (noteId) => {
    if (!user) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/notifications/apply?studentId=${user.id}&noteId=${noteId}`,
        { method: "POST" }
      );

      const data = await res.json();

      if (data.status === "SUCCESS") {
        alert("Applied successfully!");
      } else if (data.status === "ALREADY_APPLIED") {
        alert("You have already applied to this company.");
      } else {
        alert("Application failed: " + data.status);
      }
    } catch (err) {
      console.error(err);
      alert("Server error while applying.");
    }
  };


  const fetchData = () => {
    const email = localStorage.getItem("userEmail");
    fetch(`http://localhost:8080/api/auth/get-user?email=${email}`)
      .then(res => res.json())
      .then(u => {
        setUser(u);
        return fetch(`http://localhost:8080/api/notifications/student/${u.id}`);
      })
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(err => console.error("Error fetching notifications:", err));
  };

  useEffect(() => fetchData(), []);

  // --- OPTIMISTIC FAST TOGGLE ---
  const handleToggleStar = (id) => {
    if (!user) return;

    // 1. Instant UI Update
    setNotifications(prevNotes =>
      prevNotes.map(note => {
        if (note.id === id) {
          const isCurrentlyStarred = note.starredByStudentIds.includes(user.id);
          const updatedStarredIds = isCurrentlyStarred
            ? note.starredByStudentIds.filter(sid => sid !== user.id) // Remove ID
            : [...note.starredByStudentIds, user.id]; // Add ID

          return { ...note, starredByStudentIds: updatedStarredIds };
        }
        return note;
      })
    );

    // 2. Background Sync (No 'await' to keep it fast)
    fetch(`http://localhost:8080/api/notifications/star?studentId=${user.id}&noteId=${id}`, {
      method: "POST"
    }).catch(err => {
      console.error("Sync failed, rolling back...", err);
      fetchData(); // Rollback if the server is down
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-black text-gray-800 mb-6">Notifications & Drives</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notifications.map(note => {
          const isStarred = note.starredByStudentIds?.includes(user?.id);
          const isEligible = user?.cpi >= note.minCpi;

          return (
            <div key={note.id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 relative hover:shadow-lg transition-all duration-200">

              {/* FAST CHECKBOX TOGGLE */}
              <div className="absolute top-4 right-4 flex items-center gap-2 group cursor-pointer" onClick={() => handleToggleStar(note.id)}>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-indigo-500 transition-colors">Save</span>
                <input
                  type="checkbox"
                  checked={isStarred || false}
                  onChange={() => {}} // Handled by div onClick for larger click area
                  className="w-5 h-5 cursor-pointer accent-indigo-600 rounded-md"
                />
              </div>

              <div className="mb-4">
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${note.type === 'JOB_DRIVE' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {note.type === 'JOB_DRIVE' ? 'Job Drive' : 'General Notice'}
                </span>
                <h3 className="text-xl font-bold text-indigo-900 mt-2">
                  {note.type === "JOB_DRIVE" ? note.companyName : "General Announcement"}
                </h3>
              </div>

              <p className="text-gray-600 mb-4 text-sm leading-relaxed whitespace-pre-line">
                {note.description}
              </p>

              {note.attachmentPath && (
                <div className="mb-4">
                  <a
                    href={`http://localhost:8080/uploads/${note.attachmentPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-indigo-600 underline text-sm font-medium hover:text-indigo-800"
                  >
                    <span>📄</span> View Attachment (PDF)
                  </a>
                </div>
              )}

              {note.type === "JOB_DRIVE" && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-4 text-sm">
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-[10px] uppercase font-bold">Required CPI</span>
                      <span className="font-bold text-gray-700">{note.minCpi}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-gray-400 text-[10px] uppercase font-bold">Your CPI</span>
                      <span className={`font-bold ${isEligible ? 'text-green-600' : 'text-red-600'}`}>
                        {user?.cpi || "N/A"}
                      </span>
                    </div>
                  </div>

{/*                   <button */}
{/*                     disabled={!isEligible} */}
{/*                     onClick={() => handleApply(note.id)} */}
{/*                     className={`w-full py-3 rounded-xl font-bold transition-all shadow-sm ${ */}
{/*                       isEligible */}
{/*                         ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95" */}
{/*                         : "bg-gray-100 text-gray-400 cursor-not-allowed" */}
{/*                     }`} */}
{/*                   > */}
{/*                     {isEligible ? "Apply Now" : "Criteria Not Met"} */}
{/*                   </button> */}

                    <button
                      disabled={!isEligible}
                      onClick={() => handleApply(note.id)}
                      className={`w-full py-3 rounded-xl font-bold transition-all shadow-sm ${
                        isEligible
                          ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {isEligible ? "Apply Now" : "Criteria Not Met"}
                    </button>


                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentNotification;
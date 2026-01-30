// import React, { useEffect, useState, useCallback } from "react";
//
// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [profile, setProfile] = useState({
//     skills: "",
//     tenthPercentage: "",
//     twelfthPercentage: "",
//     careerPreference: "PLACEMENT",
//     resume: null,
//     resumePath: "",
//   });
//
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [feedback, setFeedback] = useState({ type: "", text: "" });
//
//   // New state for the separate feedback table
//   const [tpoFeedback, setTpoFeedback] = useState("");
//
//   const fetchAllData = useCallback(async () => {
//     const email = localStorage.getItem("userEmail");
//     if (!email) {
//       setFeedback({ type: "error", text: "Please login first" });
//       setLoading(false);
//       return;
//     }
//
//     try {
//       // 1. Fetch User basic details
//       const userRes = await fetch(`http://localhost:8080/api/auth/get-user?email=${email}`);
//       if (!userRes.ok) throw new Error("Failed to fetch user basic info");
//       const userData = await userRes.json();
//       setUser(userData);
//
//       // 2. Fetch Student Profile details
//       const profileRes = await fetch(`http://localhost:8080/api/students/profile/${userData.id}`);
//       if (profileRes.ok) {
//         const profileData = await profileRes.json();
//         setProfile({
//           ...profileData,
//           skills: profileData.skills ? profileData.skills.join(", ") : "",
//           resume: null,
//           resumePath: profileData.resumePath || "",
//         });
//       }
//
//       // 3. Fetch Feedback from the separate table
//       const feedbackRes = await fetch(`http://localhost:8080/api/feedback/student/${userData.id}`);
//       if (feedbackRes.ok) {
//         const data = await feedbackRes.text();
//         if (data !== "No feedback yet") setTpoFeedback(data);
//       }
//
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setFeedback({ type: "error", text: "Error loading profile data" });
//     } finally {
//       setLoading(false);
//     }
//   }, []);
//
//   useEffect(() => {
//     fetchAllData();
//   }, [fetchAllData]);
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setFeedback({ type: "", text: "" });
//
//     const formData = new FormData();
//     formData.append("userId", user.id);
//     formData.append("tenthPercentage", profile.tenthPercentage);
//     formData.append("twelfthPercentage", profile.twelfthPercentage);
//     formData.append("careerPreference", profile.careerPreference);
//
//     const skillArray = profile.skills.split(",").map(s => s.trim()).filter(s => s !== "");
//     skillArray.forEach(skill => formData.append("skills", skill));
//
//     if (profile.resume && profile.resume instanceof File) {
//       formData.append("resume", profile.resume);
//     }
//
//     try {
//       const response = await fetch("http://localhost:8080/api/students/profile", {
//         method: "POST",
//         body: formData,
//       });
//
//       if (response.ok) {
//         const updatedProfile = await response.json();
//         setProfile({
//           ...updatedProfile,
//           skills: updatedProfile.skills ? updatedProfile.skills.join(", ") : "",
//           resume: null,
//           resumePath: updatedProfile.resumePath,
//         });
//         setFeedback({ type: "success", text: "Profile updated successfully!" });
//         setIsEditing(false);
//         setTimeout(() => setFeedback({ type: "", text: "" }), 3000);
//       } else {
//         setFeedback({ type: "error", text: "Failed to update profile." });
//       }
//     } catch (error) {
//       setFeedback({ type: "error", text: "Server error." });
//     }
//   };
//
//   if (loading) return <div className="flex justify-center mt-20 text-blue-600 font-bold">Loading...</div>;
//
//   return (
//     <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
//       {/* Profile Header Card */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
//         <div className="h-32 bg-gradient-to-r from-blue-700 to-blue-500"></div>
//         <div className="px-8 pb-6">
//           <div className="relative -top-12 flex justify-between items-end">
//             <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-blue-600 uppercase">
//               {user?.name?.charAt(0) || "U"}
//             </div>
//             <button
//               onClick={() => {
//                 setIsEditing(!isEditing);
//                 setFeedback({ type: "", text: "" });
//               }}
//               className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
//                 isEditing ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-blue-600 text-white hover:bg-blue-700"
//               }`}
//             >
//               {isEditing ? "Cancel" : "Edit Profile"}
//             </button>
//           </div>
//           <div className="-mt-8">
//             <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
//             <p className="text-gray-500 font-medium">{user?.role} | Dharmsinh Desai University</p>
//           </div>
//         </div>
//       </div>
//
//       {/* TPO FEEDBACK SECTION (New Separate Table Data) */}
//       {tpoFeedback && (
//         <div className="mb-6 p-6 bg-amber-50 border-l-8 border-amber-500 rounded-lg shadow-sm">
//           <div className="flex items-center gap-3 mb-2">
//             <span className="text-2xl">📢</span>
//             <h3 className="text-amber-900 font-black text-lg uppercase tracking-tight">TPO Feedback for you</h3>
//           </div>
//           <p className="text-amber-800 italic text-lg leading-relaxed">"{tpoFeedback}"</p>
//           <p className="text-amber-600 text-xs mt-3 font-semibold uppercase tracking-widest">
//             Please update your profile/resume accordingly.
//           </p>
//         </div>
//       )}
//
//       {/* Save Status Messages */}
//       {feedback.text && (
//         <div className={`mb-6 p-4 rounded-xl text-center font-bold border ${
//           feedback.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
//         }`}>
//           {feedback.text}
//         </div>
//       )}
//
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-1 space-y-6">
//           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//             <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Contact Info</h3>
//             <div className="space-y-3">
//               <p className="text-sm font-medium text-gray-700 flex flex-col">
//                 <span className="text-gray-400 text-xs font-bold uppercase">Email</span> {user?.email}
//               </p>
//               <p className="text-sm font-medium text-gray-700 flex flex-col">
//                 <span className="text-gray-400 text-xs font-bold uppercase">Mobile</span> +91 {user?.mobile}
//               </p>
//               <p className="text-sm font-medium text-gray-700 flex flex-col">
//                 <span className="text-gray-400 text-xs font-bold uppercase">CPI</span> {user?.cpi || "N/A"}
//               </p>
//             </div>
//           </div>
//         </div>
//
//         <div className="lg:col-span-2">
//           <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
//             <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Professional Details</h2>
//
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-bold text-gray-600 mb-2">10th Percentage</label>
//                 <input
//                   type="number" step="0.01" disabled={!isEditing}
//                   value={profile.tenthPercentage || ""}
//                   onChange={(e) => setProfile({ ...profile, tenthPercentage: e.target.value })}
//                   className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none disabled:opacity-60"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-bold text-gray-600 mb-2">12th Percentage</label>
//                 <input
//                   type="number" step="0.01" disabled={!isEditing}
//                   value={profile.twelfthPercentage || ""}
//                   onChange={(e) => setProfile({ ...profile, twelfthPercentage: e.target.value })}
//                   className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none disabled:opacity-60"
//                   required
//                 />
//               </div>
//             </div>
//
//             <div>
//               <label className="block text-sm font-bold text-gray-600 mb-2">Technical Skills</label>
//               <input
//                 type="text" disabled={!isEditing}
//                 value={profile.skills || ""}
//                 onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
//                 placeholder="e.g. Java, React, Python"
//                 className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none disabled:opacity-60"
//                 required
//               />
//             </div>
//
//             <div>
//               <label className="block text-sm font-bold text-gray-600 mb-2">Career Preference</label>
//               <select
//                 disabled={!isEditing}
//                 value={profile.careerPreference}
//                 onChange={(e) => setProfile({ ...profile, careerPreference: e.target.value })}
//                 className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none disabled:opacity-60"
//               >
//                 <option value="PLACEMENT">Campus Placement</option>
//                 <option value="HIGHER_STUDIES">Higher Studies</option>
//               </select>
//             </div>
//
//             <div className="pt-4">
//               <label className="block text-sm font-bold text-gray-600 mb-2">Resume (PDF)</label>
//               <div className="flex items-center space-x-4">
//                 {isEditing ? (
//                   <input
//                     type="file" accept=".pdf"
//                     onChange={(e) => setProfile({ ...profile, resume: e.target.files[0] })}
//                     className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                   />
//                 ) : (
//                   <div className="flex items-center gap-3">
//                     {profile.resumePath ? (
//                       <>
//                         <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full flex items-center gap-2 border border-green-200 text-sm font-medium">
//                           Uploaded
//                         </span>
//                         <a
//                           href={`http://localhost:8080/uploads/resumes/${profile.resumePath}`}
//                           target="_blank" rel="noopener noreferrer"
//                           className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold border border-blue-200 hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
//                         >
//                           View PDF
//                         </a>
//                       </>
//                     ) : (
//                       <span className="text-gray-400 italic bg-gray-100 px-4 py-2 rounded-full border border-gray-200 text-sm">
//                         No resume uploaded yet
//                       </span>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//
//             {isEditing && (
//               <button
//                 type="submit"
//                 className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-shadow shadow-md hover:shadow-lg"
//               >
//                 Save All Changes
//               </button>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default Profile;


import React, { useEffect, useState, useCallback } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    skills: "",
    tenthPercentage: "",
    twelfthPercentage: "",
    careerPreference: "PLACEMENT",
    resume: null,
    resumePath: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [tpoFeedback, setTpoFeedback] = useState("");

  const fetchAllData = useCallback(async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      setFeedback({ type: "error", text: "Please login first" });
      setLoading(false);
      return;
    }

    try {
      // 1. Fetch User basic details
      const userRes = await fetch(`http://localhost:8080/api/auth/get-user?email=${email}`);
      if (!userRes.ok) throw new Error("Failed to fetch user basic info");
      const userData = await userRes.json();
      setUser(userData);

      // 2. Fetch Student Profile details
      const profileRes = await fetch(`http://localhost:8080/api/students/profile/${userData.id}`);
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile({
          ...profileData,
          // Handle null values from database to prevent uncontrolled input errors
          tenthPercentage: profileData.tenthPercentage ?? "",
          twelfthPercentage: profileData.twelfthPercentage ?? "",
          skills: profileData.skills ? profileData.skills.join(", ") : "",
          careerPreference: profileData.careerPreference || "PLACEMENT",
          resume: null,
          resumePath: profileData.resumePath || "",
        });
      }

      // 3. Fetch TPO Feedback
      const feedbackRes = await fetch(`http://localhost:8080/api/feedback/student/${userData.id}`);
      if (feedbackRes.ok) {
        const data = await feedbackRes.text();
        if (data !== "No feedback yet") setTpoFeedback(data);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      setFeedback({ type: "error", text: "Error loading profile data" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", text: "" });

    // CRITICAL VALIDATION: Prevent sending empty academic data (Fixes Backend 500)
    if (!profile.tenthPercentage || !profile.twelfthPercentage) {
      setFeedback({ type: "error", text: "10th and 12th percentages are required for job eligibility." });
      return;
    }

    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("tenthPercentage", profile.tenthPercentage);
    formData.append("twelfthPercentage", profile.twelfthPercentage);
    formData.append("careerPreference", profile.careerPreference);

    const skillArray = profile.skills.split(",").map(s => s.trim()).filter(s => s !== "");
    skillArray.forEach(skill => formData.append("skills", skill));

    // Optional File Upload: Only append if a file was selected
    if (profile.resume && profile.resume instanceof File) {
      formData.append("resume", profile.resume);
    }

    try {
      const response = await fetch("http://localhost:8080/api/students/profile", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile({
          ...updatedProfile,
          tenthPercentage: updatedProfile.tenthPercentage ?? "",
          twelfthPercentage: updatedProfile.twelfthPercentage ?? "",
          skills: updatedProfile.skills ? updatedProfile.skills.join(", ") : "",
          resume: null,
          resumePath: updatedProfile.resumePath,
        });
        setFeedback({ type: "success", text: "Profile updated successfully!" });
        setIsEditing(false);
        setTimeout(() => setFeedback({ type: "", text: "" }), 3000);
      } else {
        const errorMsg = await response.text();
        setFeedback({ type: "error", text: `Update failed: ${errorMsg}` });
      }
    } catch (error) {
      setFeedback({ type: "error", text: "Server error. Ensure DB column sizes are updated." });
    }
  };

  if (loading) return <div className="flex justify-center mt-20 text-blue-600 font-bold">Loading Profile...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-r from-blue-700 to-blue-500"></div>
        <div className="px-8 pb-6">
          <div className="relative -top-12 flex justify-between items-end">
            <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-blue-600 uppercase">
              {user?.name?.charAt(0) || "U"}
            </div>
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                setFeedback({ type: "", text: "" });
              }}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                isEditing ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
          <div className="-mt-8">
            <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
            <p className="text-gray-500 font-medium">{user?.role} | Dharmsinh Desai University</p>
          </div>
        </div>
      </div>

      {/* TPO Feedback Alert */}
      {tpoFeedback && (
        <div className="mb-6 p-6 bg-amber-50 border-l-8 border-amber-500 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📢</span>
            <h3 className="text-amber-900 font-bold uppercase">Feedback from TPO</h3>
          </div>
          <p className="text-amber-800 italic">"{tpoFeedback}"</p>
        </div>
      )}

      {/* Success/Error Feedback */}
      {feedback.text && (
        <div className={`mb-6 p-4 rounded-xl text-center font-bold border ${
          feedback.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
        }`}>
          {feedback.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Contact Info</h3>
            <div className="space-y-4 text-sm font-medium">
              <div><span className="text-gray-400 text-xs block">EMAIL</span>{user?.email}</div>
              <div><span className="text-gray-400 text-xs block">MOBILE</span>+91 {user?.mobile}</div>
              <div><span className="text-gray-400 text-xs block">CURRENT CPI</span>{user?.cpi || "Not Set"}</div>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Academic & Career Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">10th Percentage (%)</label>
                <input
                  type="number" step="0.01" min="0" max="100" disabled={!isEditing}
                  value={profile.tenthPercentage}
                  onChange={(e) => setProfile({ ...profile, tenthPercentage: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none disabled:opacity-60"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">12th Percentage (%)</label>
                <input
                  type="number" step="0.01" min="0" max="100" disabled={!isEditing}
                  value={profile.twelfthPercentage}
                  onChange={(e) => setProfile({ ...profile, twelfthPercentage: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none disabled:opacity-60"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Technical Skills</label>
              <input
                type="text" disabled={!isEditing}
                value={profile.skills}
                onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                placeholder="Java, Python, React, etc."
                className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Career Preference</label>
              <select
                disabled={!isEditing}
                value={profile.careerPreference}
                onChange={(e) => setProfile({ ...profile, careerPreference: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
              >
                <option value="PLACEMENT">Campus Placement</option>
                <option value="HIGHER_STUDIES">Higher Studies</option>
                <option value="BOTH">Open to Both</option>
              </select>
            </div>

            <div className="pt-4">
              <label className="block text-sm font-bold text-gray-600 mb-2">Resume (PDF)</label>
              <div className="flex items-center space-x-4">
                {isEditing ? (
                  <input
                    type="file" accept=".pdf"
                    onChange={(e) => setProfile({ ...profile, resume: e.target.files[0] })}
                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    {profile.resumePath ? (
                      <a
                        href={`http://localhost:8080/uploads/resumes/${profile.resumePath}`}
                        target="_blank" rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold border border-blue-200 hover:bg-blue-600 hover:text-white transition-all"
                      >
                        View My Resume
                      </a>
                    ) : (
                      <span className="text-gray-400 italic text-sm">No resume uploaded yet</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md transition-all"
              >
                Save Profile
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
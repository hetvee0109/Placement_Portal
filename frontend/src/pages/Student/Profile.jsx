// import React, { useEffect, useState } from "react";
//
// function Profile() {
//   const [user, setUser] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     cpi: "",
//     role: "",
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//
//   useEffect(() => {
//     const email = localStorage.getItem("userEmail");
//     if (!email) {
//       setError("User not logged in!");
//       setLoading(false);
//       return;
//     }
//
//     fetch(`http://localhost:8080/api/auth/get-user?email=${email}`)
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch user data");
//         return res.json();
//       })
//       .then((data) => {
//         setUser(data || {}); // Handle null from backend
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, []);
//
//   if (loading) return <p className="text-center mt-10">Loading profile...</p>;
//   if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
//
//   return (
//     <div className="max-w-4xl mx-auto mt-10">
//       <h1 className="text-3xl font-bold text-blue-700 mb-6">My Profile</h1>
//
//       <div className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">
//         {/* Header strip */}
//         <div className="bg-blue-600 h-24 w-full"></div>
//
//         <div className="p-6 -mt-12">
//           {/* Avatar */}
//           <div className="bg-white w-24 h-24 rounded-full border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-blue-600 mb-4">
//             {user.name?.[0]?.toUpperCase() || "U"}
//           </div>
//
//           <div className="space-y-4">
//             {/* Name */}
//             <div>
//               <label className="text-xs font-bold text-gray-400 uppercase">
//                 Name
//               </label>
//               <p className="text-lg font-medium text-gray-800">
//                 {user.name || "N/A"}
//               </p>
//             </div>
//
//             {/* Email */}
//             <div>
//               <label className="text-xs font-bold text-gray-400 uppercase">
//                 Email
//               </label>
//               <p className="text-lg font-medium text-gray-800">
//                 {user.email || "N/A"}
//               </p>
//             </div>
//
//             {/* Grid info */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="text-xs font-bold text-gray-400 uppercase">
//                   Role
//                 </label>
//                 <p className="text-md font-medium text-gray-700">
//                   {user.role || "N/A"}
//                 </p>
//               </div>
//
//               <div>
//                 <label className="text-xs font-bold text-gray-400 uppercase">
//                   University
//                 </label>
//                 <p className="text-md font-medium text-gray-700">
//                   Dharmsinh Desai University
//                 </p>
//               </div>
//
//               <div>
//                 <label className="text-xs font-bold text-gray-400 uppercase">
//                   CPI
//                 </label>
//                 <p className="text-md font-medium text-gray-700">
//                   {user.cpi !== null ? user.cpi : "N/A"}
//                 </p>
//               </div>
//
//               <div>
//                 <label className="text-xs font-bold text-gray-400 uppercase">
//                   Mobile Number
//                 </label>
//                 <p className="text-md font-medium text-gray-700">
//                   +91 {user.mobile || "N/A"}
//                 </p>
//               </div>
//             </div>
//           </div>
//
//           <button className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
//             Edit Profile
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
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

  // 1. Defined fetch function outside useEffect so it's accessible everywhere
  const fetchAllData = useCallback(async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      setFeedback({ type: "error", text: "Please login first" });
      setLoading(false);
      return;
    }

    try {
      // Fetch User basic details
      const userRes = await fetch(`http://localhost:8080/api/auth/get-user?email=${email}`);
      if (!userRes.ok) throw new Error("Failed to fetch user basic info");
      const userData = await userRes.json();
      setUser(userData);

      // Fetch Student Profile details using userId
      const profileRes = await fetch(`http://localhost:8080/api/students/profile/${userData.id}`);
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile({
          ...profileData,
          skills: profileData.skills ? profileData.skills.join(", ") : "",
          resume: null, // Reset file input buffer
          resumePath: profileData.resumePath || "",
        });
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

  // 2. Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", text: "" });

    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("tenthPercentage", profile.tenthPercentage);
    formData.append("twelfthPercentage", profile.twelfthPercentage);
    formData.append("careerPreference", profile.careerPreference);

    // Append skills individually for List<String> compatibility
    const skillArray = profile.skills.split(",").map(s => s.trim()).filter(s => s !== "");
    skillArray.forEach(skill => {
      formData.append("skills", skill);
    });

    // Append the file with key "resume"
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

        // Update local state with fresh data from backend
        setProfile({
          ...updatedProfile,
          skills: updatedProfile.skills ? updatedProfile.skills.join(", ") : "",
          resume: null,
          resumePath: updatedProfile.resumePath,
        });

        setFeedback({ type: "success", text: "Profile updated successfully!" });
        setIsEditing(false);

        // Auto-clear success message after 3 seconds
        setTimeout(() => setFeedback({ type: "", text: "" }), 3000);
      } else {
        setFeedback({ type: "error", text: "Failed to update profile. Ensure all fields are valid." });
      }
    } catch (error) {
      setFeedback({ type: "error", text: "Server error. Check if your backend is running." });
    }
  };

  if (loading) return <div className="flex justify-center mt-20 text-blue-600 font-bold">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Profile Header Card */}
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
                setFeedback({ type: "", text: "" }); // Clear messages on toggle
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

      {/* Unified Feedback Message */}
      {feedback.text && (
        <div className={`mb-6 p-4 rounded-xl text-center font-bold border ${
          feedback.type === "success"
            ? "bg-green-50 text-green-700 border-green-200"
            : "bg-red-50 text-red-700 border-red-200"
        }`}>
          {feedback.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Stats Side Bar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Contact Info</h3>
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 flex flex-col">
                <span className="text-gray-400 text-xs font-bold uppercase">Email</span> {user?.email}
              </p>
              <p className="text-sm font-medium text-gray-700 flex flex-col">
                <span className="text-gray-400 text-xs font-bold uppercase">Mobile</span> +91 {user?.mobile}
              </p>
              <p className="text-sm font-medium text-gray-700 flex flex-col">
                <span className="text-gray-400 text-xs font-bold uppercase">CPI</span> {user?.cpi || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Form Details Main Area */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Professional Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">10th Percentage</label>
                <input
                  type="number"
                  step="0.01"
                  disabled={!isEditing}
                  value={profile.tenthPercentage || ""}
                  onChange={(e) => setProfile({ ...profile, tenthPercentage: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none disabled:opacity-60"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">12th Percentage</label>
                <input
                  type="number"
                  step="0.01"
                  disabled={!isEditing}
                  value={profile.twelfthPercentage || ""}
                  onChange={(e) => setProfile({ ...profile, twelfthPercentage: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none disabled:opacity-60"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Technical Skills (Comma separated)</label>
              <input
                type="text"
                disabled={!isEditing}
                value={profile.skills || ""}
                onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                placeholder="e.g. Java, React, Python, SQL"
                className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none disabled:opacity-60"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Career Preference</label>
              <select
                disabled={!isEditing}
                value={profile.careerPreference}
                onChange={(e) => setProfile({ ...profile, careerPreference: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none disabled:opacity-60"
              >
                <option value="PLACEMENT">Campus Placement</option>
                <option value="HIGHER_STUDIES">Higher Studies</option>
              </select>
            </div>

            <div className="pt-4">
              <label className="block text-sm font-bold text-gray-600 mb-2">Resume (PDF)</label>
              <div className="flex items-center space-x-4">
                {isEditing ? (
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setProfile({ ...profile, resume: e.target.files[0] })}
                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    {profile.resumePath ? (
                      <>
                        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full flex items-center gap-2 border border-green-200 text-sm font-medium">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Uploaded
                        </span>

                        {/* VIEW RESUME BUTTON */}
                        <a
                          href={`http://localhost:8080/uploads/resumes/${profile.resumePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold border border-blue-200 hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View PDF
                        </a>
                      </>
                    ) : (
                      <span className="text-gray-400 italic bg-gray-100 px-4 py-2 rounded-full border border-gray-200 text-sm">
                        No resume uploaded yet
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-shadow shadow-md hover:shadow-lg"
              >
                Save All Changes
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
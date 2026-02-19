import React, { useEffect, useState } from "react";

const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [user, setUser] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);

  const fetchApplications = (studentId) => {
    fetch(`http://localhost:8080/api/applications/student/${studentId}`)
      .then((res) => res.json())
      .then((data) => setApplications(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    const email = localStorage.getItem("userEmail");

    fetch(`http://localhost:8080/api/auth/get-user?email=${email}`)
      .then((res) => res.json())
      .then((u) => {
        setUser(u);
        fetchApplications(u.id);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleFileUpload = async (e, appId) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadingId(appId);
    try {
      const response = await fetch(`http://localhost:8080/api/applications/${appId}/upload-offer`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Offer Letter Uploaded! ✅");
        fetchApplications(user.id); // Refresh data
      } else {
        alert("Upload failed ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-black mb-8 text-gray-800">My Job Applications</h1>

      {applications.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed">
          <p className="text-gray-400">You haven’t applied to any company yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div key={app.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-indigo-900">
                    {app.notification?.companyName || "Unknown Company"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{app.notification?.description}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  app.status === "SELECTED" ? "bg-green-100 text-green-700" :
                  app.status === "REJECTED" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {app.status}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                <p className="text-[10px] text-gray-400 font-medium">
                  Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                </p>

                {/* ✅ UPLOAD SECTION: Only shows if SELECTED */}
                {app.status === "SELECTED" && (
                  <div className="flex flex-col items-end gap-2">
                    <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                      {uploadingId === app.id ? "Uploading..." : app.offerLetterPath ? "Change Offer Letter" : "Upload Offer Letter"}
                      <input
                        type="file"
                        hidden
                        onChange={(e) => handleFileUpload(e, app.id)}
                        disabled={uploadingId === app.id}
                      />
                    </label>
                    {app.offerLetterPath && (
                      <span className="text-[9px] text-green-600 font-bold italic">
                         ✓ {app.offerLetterPath.split('_').pop()}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplications;

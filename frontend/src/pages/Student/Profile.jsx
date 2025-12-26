import React, { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile: "",
    cpi: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      setError("User not logged in!");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/api/auth/get-user?email=${email}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user data");
        return res.json();
      })
      .then((data) => {
        setUser(data || {}); // Handle null from backend
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">My Profile</h1>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">
        {/* Header strip */}
        <div className="bg-blue-600 h-24 w-full"></div>

        <div className="p-6 -mt-12">
          {/* Avatar */}
          <div className="bg-white w-24 h-24 rounded-full border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-blue-600 mb-4">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">
                Name
              </label>
              <p className="text-lg font-medium text-gray-800">
                {user.name || "N/A"}
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">
                Email
              </label>
              <p className="text-lg font-medium text-gray-800">
                {user.email || "N/A"}
              </p>
            </div>

            {/* Grid info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">
                  Role
                </label>
                <p className="text-md font-medium text-gray-700">
                  {user.role || "N/A"}
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">
                  University
                </label>
                <p className="text-md font-medium text-gray-700">
                  Dharmsinh Desai University
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">
                  CPI
                </label>
                <p className="text-md font-medium text-gray-700">
                  {user.cpi !== null ? user.cpi : "N/A"}
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">
                  Mobile Number
                </label>
                <p className="text-md font-medium text-gray-700">
                  +91 {user.mobile || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <button className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;

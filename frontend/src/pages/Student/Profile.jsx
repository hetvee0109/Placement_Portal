import React from "react";

function Profile() {
  const userEmail = localStorage.getItem("userEmail") || "Not Logged In";
  const userRole = localStorage.getItem("userRole") || "STUDENT";

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">My Profile</h1>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-blue-600 h-24 w-full"></div>

        <div className="p-6 -mt-12">
          <div className="bg-white w-24 h-24 rounded-full border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-blue-600 mb-4">
            {userEmail[0].toUpperCase()}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
              <p className="text-lg font-medium text-gray-800">{userEmail}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Role</label>
                <p className="text-md font-medium text-gray-700">{userRole}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">University</label>
                <p className="text-md font-medium text-gray-700">Dharmsinh Desai University</p>
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
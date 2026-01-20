import React, { useEffect, useState } from "react";

const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [user, setUser] = useState(null);

  const statusColor = (status) => {
    if (status === "SELECTED") return "text-green-600";
    if (status === "REJECTED") return "text-red-600";
    return "text-amber-600";
  };


  useEffect(() => {
    const email = localStorage.getItem("userEmail");

    fetch(`http://localhost:8080/api/auth/get-user?email=${email}`)
      .then(res => res.json())
      .then(u => {
        setUser(u);
        return fetch(`http://localhost:8080/api/job-applications/student/${u.id}`);
      })
      .then(res => res.json())
      .then(data => setApplications(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-black mb-6">My Job Applications</h1>

      {applications.length === 0 ? (
        <p className="text-gray-400 text-sm">You haven’t applied to any company yet.</p>
      ) : (
        <div className="space-y-4">
          {applications.map(app => (
            <div
              key={app.id}
              className="bg-white p-5 rounded-xl shadow border"
            >
              <h3 className="text-lg font-bold text-indigo-800">
                {app.notification.companyName}
              </h3>

              <p className="text-sm text-gray-600 mt-1">
                {app.notification.description}
              </p>

              <p className="text-xs text-gray-400 mt-2">
                Applied on: {new Date(app.appliedAt).toLocaleString()}
              </p>
              <span
                className={
                  app.status === "SELECTED"
                    ? "text-green-600"
                    : app.status === "REJECTED"
                    ? "text-red-600"
                    : "text-yellow-600"
                }
              >
                {app.status}
              </span>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplications;

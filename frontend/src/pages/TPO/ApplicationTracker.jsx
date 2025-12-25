// src/pages/ApplicationTracker.jsx
const ApplicationTracker = () => {
  const applications = [
    { id: 1, student: "Alice", company: "Google", status: "Selected" },
    { id: 2, student: "Bob", company: "Microsoft", status: "Pending" },
    { id: 3, student: "Charlie", company: "Amazon", status: "Rejected" },
  ];

  return (
    <div className="pt-[80px] p-6">
      <h1 className="text-2xl font-bold mb-4">Application Tracker</h1>
      <table className="w-full table-auto border border-gray-200">
        <thead>
          <tr className="bg-blue-50">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Student</th>
            <th className="border px-4 py-2">Company</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((a) => (
            <tr key={a.id}>
              <td className="border px-4 py-2">{a.id}</td>
              <td className="border px-4 py-2">{a.student}</td>
              <td className="border px-4 py-2">{a.company}</td>
              <td className={`border px-4 py-2 font-medium ${
                a.status === "Selected" ? "text-green-600" :
                a.status === "Rejected" ? "text-red-600" :
                "text-yellow-600"
              }`}>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ApplicationTracker;

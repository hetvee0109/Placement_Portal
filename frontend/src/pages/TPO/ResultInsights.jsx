// src/pages/ResumeInsights.jsx
const ResumeInsights = () => {
  const resumes = [
    { id: 1, name: "Alice", status: "Reviewed" },
    { id: 2, name: "Bob", status: "Pending" },
    { id: 3, name: "Charlie", status: "Reviewed" },
  ];

  return (
    <div className="pt-[80px] p-6">
      <h1 className="text-2xl font-bold mb-4">Resume Insights</h1>
      <ul className="space-y-2">
        {resumes.map((r) => (
          <li key={r.id} className="p-4 bg-blue-50 rounded shadow flex justify-between">
            <span>{r.name}</span>
            <span className={`font-medium ${r.status === "Reviewed" ? "text-green-600" : "text-yellow-600"}`}>
              {r.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ResumeInsights;

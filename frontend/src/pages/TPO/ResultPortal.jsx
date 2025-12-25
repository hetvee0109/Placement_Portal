// src/pages/ResultPortal.jsx
const ResultPortal = () => {
  const results = [
    { student: "Alice", company: "Google", result: "Placed" },
    { student: "Bob", company: "Microsoft", result: "Waiting" },
    { student: "Charlie", company: "Amazon", result: "Not Placed" },
  ];

  return (
    <div className="pt-[80px] p-6">
      <h1 className="text-2xl font-bold mb-4">Result Portal</h1>
      <ul className="space-y-2">
        {results.map((r, i) => (
          <li key={i} className="p-4 bg-blue-50 rounded shadow flex justify-between">
            <span>{r.student} - {r.company}</span>
            <span className={`font-medium ${r.result === "Placed" ? "text-green-600" : r.result === "Waiting" ? "text-yellow-600" : "text-red-600"}`}>
              {r.result}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ResultPortal;

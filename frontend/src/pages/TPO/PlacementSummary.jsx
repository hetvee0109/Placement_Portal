import React, { useEffect, useState } from "react";

const PlacementSummary = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/placements/summary")
      .then((res) => res.json())
      .then((data) => setRecords(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-black text-gray-800 mb-6 border-b pb-4">
        🎓 Placement Summary
      </h2>
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-indigo-600 text-white text-sm uppercase">
              <th className="px-6 py-4">Student Name</th>
              <th className="px-6 py-3">Company</th>
              <th className="px-6 py-3">Package (CTC)</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-700">{r.studentName}</td>
                <td className="px-6 py-4 text-indigo-700 font-medium">{r.companyName}</td>
                <td className="px-6 py-4 text-green-600 font-bold">₹{r.finalCtc} LPA</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{r.selectionDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlacementSummary;
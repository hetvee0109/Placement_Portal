// import React, { useEffect, useState } from "react";
//
// const PlacementSummary = () => {
//   const [records, setRecords] = useState([]);
//
//   useEffect(() => {
//     fetch("http://localhost:8080/api/placements/summary")
//       .then((res) => res.json())
//       .then((data) => setRecords(data))
//       .catch((err) => console.error(err));
//   }, []);
//
//   return (
//     <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
//       <h2 className="text-2xl font-black text-gray-800 mb-6 border-b pb-4">
//         🎓 Placement Summary
//       </h2>
//       <div className="overflow-hidden rounded-xl border border-gray-200">
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="bg-indigo-600 text-white text-sm uppercase">
//               <th className="px-6 py-4">Student Name</th>
//               <th className="px-6 py-3">Company</th>
//               <th className="px-6 py-3">Package (CTC)</th>
//               <th className="px-6 py-3">Date</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100">
//             {records.map((r) => (
//               <tr key={r.id} className="hover:bg-gray-50 transition-colors">
//                 <td className="px-6 py-4 font-semibold text-gray-700">{r.studentName}</td>
//                 <td className="px-6 py-4 text-indigo-700 font-medium">{r.companyName}</td>
//                 <td className="px-6 py-4 text-green-600 font-bold">₹{r.finalCtc} LPA</td>
//                 <td className="px-6 py-4 text-gray-500 text-sm">{r.selectionDate}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };
//
// export default PlacementSummary;


import React, { useEffect, useState, useMemo } from "react";

const PlacementSummary = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/placements/summary");
      const data = await res.json();
      setRecords(data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load placement summary. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  // ✅ Search filter
  const filteredRecords = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return records;

    return records.filter((r) => {
      const student = (r.studentName || "").toLowerCase();
      const company = (r.companyName || "").toLowerCase();
      return student.includes(term) || company.includes(term);
    });
  }, [records, search]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto mt-10 p-10 text-center font-bold text-indigo-600">
        Loading Placement Summary...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-3xl shadow-sm border mt-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-black text-gray-800">
          🎓 Placement Summary
        </h2>

        <div className="flex gap-3 w-full md:w-auto">
          <input
            type="text"
            value={search}
            placeholder="Search student / company..."
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-72 border p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300"
          />

          <button
            onClick={fetchSummary}
            className="bg-indigo-600 text-white px-5 rounded-xl font-black"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      {filteredRecords.length === 0 ? (
        <p className="text-gray-400 italic">No placement records found.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border">
          <table className="w-full text-left">
            <thead className="bg-indigo-600 text-white text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Final CTC (LPA)</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredRecords.map((r, index) => (
                <tr key={r.id || index} className="hover:bg-indigo-50/50">
                  <td className="px-6 py-4 font-bold">{r.studentName}</td>

                  <td className="px-6 py-4 text-indigo-700 font-semibold">
                    {r.companyName}
                  </td>

                  <td className="px-6 py-4 text-green-600 font-black">
                    ₹{r.finalCtc} LPA
                  </td>

                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {r.selectionDate || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PlacementSummary;

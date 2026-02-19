import React, { useEffect, useState, useMemo } from "react";
import * as XLSX from "xlsx";

const PlacementSummary = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/placements/summary");
      const data = await res.json();

      // Remove duplicates: Keep the record with the highest CTC per student
      const uniqueStudents = {};
      data.forEach((record) => {
        const name = record.studentName;
        if (!uniqueStudents[name] || record.finalCtc > uniqueStudents[name].finalCtc) {
          uniqueStudents[name] = record;
        }
      });

      setRecords(Object.values(uniqueStudents) || []);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to load placement summary.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const filteredRecords = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return records;
    return records.filter((r) =>
      r.studentName?.toLowerCase().includes(term) ||
      r.companyName?.toLowerCase().includes(term)
    );
  }, [records, search]);

  const downloadExcel = () => {
    if (filteredRecords.length === 0) return;

    const worksheetData = filteredRecords.map((r) => ({
      "Student Name": r.studentName,
      "Company Name": r.companyName,
      "CTC (LPA)": `₹${r.finalCtc} LPA`,
      "Selection Date": r.selectionDate ? new Date(r.selectionDate).toLocaleDateString() : "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Placement Summary");
    XLSX.writeFile(workbook, `Placement_Summary_${new Date().toLocaleDateString()}.xlsx`);
  };

  if (loading) return <div className="p-20 text-center font-bold text-indigo-600 animate-pulse">Loading Summary...</div>;

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-3xl shadow-sm border mt-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">🎓 Placement Summary</h2>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Unique placed students only</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search student or company..."
            className="border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-indigo-300 w-64 text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={downloadExcel} className="bg-green-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all shadow-md">
            Download Excel
          </button>
          <button onClick={fetchSummary} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md">
            Refresh
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-[#5c56e1] text-white text-[10px] uppercase tracking-[0.2em] font-black">
            <tr>
              <th className="px-8 py-5">Student Name</th>
              <th className="px-8 py-5">Company</th>
              <th className="px-8 py-5">Final CTC (LPA)</th>
              <th className="px-8 py-5 text-right">Selection Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {filteredRecords.map((r, index) => (
              <tr key={index} className="hover:bg-indigo-50/30 transition-colors group">
                <td className="px-8 py-5 font-bold text-gray-900">{r.studentName}</td>
                <td className="px-8 py-5">
                  <span className="text-indigo-600 font-black text-[11px] uppercase bg-indigo-50 px-3 py-1 rounded-lg">
                    {r.companyName}
                  </span>
                </td>
                <td className="px-8 py-5 font-black text-green-600">₹{r.finalCtc} LPA</td>
                <td className="px-8 py-5 text-right text-gray-400 font-black text-xs uppercase">
                  {r.selectionDate ? (
                    new Date(r.selectionDate).toLocaleDateString('en-GB', {
                      day: '2-digit', month: 'short', year: 'numeric'
                    })
                  ) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlacementSummary;
// src/pages/StudentManagement.jsx
const StudentManagement = () => {
  const students = [
    { id: 1, name: "Alice", department: "CSE" },
    { id: 2, name: "Bob", department: "ECE" },
    { id: 3, name: "Charlie", department: "ME" },
  ];

  return (
    <div className="pt-[80px] p-6">
      <h1 className="text-2xl font-bold mb-4">Student Management</h1>
      <table className="w-full table-auto border border-gray-200">
        <thead>
          <tr className="bg-blue-50">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Department</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td className="border px-4 py-2">{s.id}</td>
              <td className="border px-4 py-2">{s.name}</td>
              <td className="border px-4 py-2">{s.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default StudentManagement;

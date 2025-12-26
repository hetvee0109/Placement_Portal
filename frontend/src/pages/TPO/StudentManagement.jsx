import React, { useEffect, useState } from "react";

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/students");
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/auth/students/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete student");

      // Animate deletion: add a fade-out class before removing
      const element = document.getElementById(`student-${id}`);
      element.classList.add("opacity-0", "transform", "-translate-x-4", "transition-all", "duration-300");

      setTimeout(() => {
        setStudents((prev) => prev.filter((s) => s.id !== id));
      }, 300);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600 animate-pulse">
        Loading students...
      </p>
    );
  if (error)
    return (
      <p className="text-center text-red-500 mt-10 font-semibold">{error}</p>
    );

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        Student Management
      </h1>

      {students.length === 0 ? (
        <p className="text-center text-gray-500">No students found.</p>
      ) : (
        <ul className="space-y-3">
          {students.map((student) => (
            <li
              key={student.id}
              id={`student-${student.id}`}
              className="flex justify-between items-center bg-white p-4 border rounded shadow hover:shadow-lg transition-shadow duration-300"
            >
              <span className="text-lg font-medium text-gray-800">
                {student.name}
              </span>
              <button
                onClick={() => handleDelete(student.id)}
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition transform hover:scale-105"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";

const ResumeInsights = () => {
  const [students, setStudents] = useState([]);
  const [feedbackTexts, setFeedbackTexts] = useState({}); // Stores input for each student
  const [loading, setLoading] = useState(true);

  // Load students on mount
  useEffect(() => {
    fetch("http://localhost:8080/api/students?role=TPO")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  const handleTextChange = (studentId, value) => {
    setFeedbackTexts({ ...feedbackTexts, [studentId]: value });
  };

  const submitFeedback = async (studentId) => {
    const comment = feedbackTexts[studentId];
    if (!comment || comment.trim() === "") {
      alert("Please enter some feedback first.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/feedback/submit?studentId=${studentId}`, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: comment,
      });

      if (response.ok) {
        alert(`Feedback has been successfully sent to the student.`);
        setFeedbackTexts({ ...feedbackTexts, [studentId]: "" }); // Clear input
      } else {
        alert("Failed to send feedback.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Students...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Resume Insights & TPO Feedback</h1>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Student Name</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Resume</th>
              <th className="p-4 font-semibold text-gray-600">Provide Feedback</th>
              <th className="p-4 font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-700">{student.name}</td>
                <td className="p-4 text-center">
                  <a
                    href={`http://localhost:8080/uploads/resumes/${student.id}_resume.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-bold underline"
                  >
                    View PDF
                  </a>
                </td>
                <td className="p-4">
                  <textarea
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                    rows="2"
                    placeholder="E.g., Improve your project descriptions..."
                    value={feedbackTexts[student.id] || ""}
                    onChange={(e) => handleTextChange(student.id, e.target.value)}
                  />
                </td>
                <td className="p-4">
                  <button
                    onClick={() => submitFeedback(student.id)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md"
                  >
                    Send
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResumeInsights;

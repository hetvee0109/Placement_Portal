import React, { useState } from "react";
import { Link, useNavigate } from "react-router";

function SignUp() {
  const navigate = useNavigate();
  const [role, setRole] = useState("STUDENT");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    cpi: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ CLIENT-SIDE VALIDATIONS
    if (!formData.name.trim()) {
      alert("Name is required!");
      return;
    }

    if (!formData.email.trim()) {
      alert("Email is required!");
      return;
    }

    // Optional: validate DDU email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@ddu\.ac\.in$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid DDU email!");
      return;
    }

    if (!formData.mobile.trim() || formData.mobile.length < 10) {
      alert("Enter a valid mobile number!");
      return;
    }

    if (role === "STUDENT" && (!formData.cpi || isNaN(formData.cpi))) {
      alert("Enter a valid CPI for Student!");
      return;
    }

    if (!formData.password) {
      alert("Password is required!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // ✅ SEND TO BACKEND
    try {
      const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role,
          cpi: formData.cpi ? parseFloat(formData.cpi) : null,
        }),
      });

      const msg = await res.text();

      if (res.ok && msg.toLowerCase().includes("success")) {
        alert("Registration Successful!");
        navigate("/signin");
      } else {
        alert(msg);
      }
    } catch (err) {
      alert("Server not reachable. Is Spring Boot running?");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">

        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Create Account
        </h2>

        {/* Role Selection */}
        <div className="flex mb-4">
          <button
            type="button"
            className={`flex-1 py-2 ${role === "STUDENT" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setRole("STUDENT")}
          >
            Student
          </button>
          <button
            type="button"
            className={`flex-1 py-2 ${role === "TPO" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setRole("TPO")}
          >
            TPO
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="Full Name" required className="w-full border p-2 rounded" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <input type="email" placeholder="Email" required className="w-full border p-2 rounded" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <input type="text" placeholder="Mobile" required className="w-full border p-2 rounded" onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} />

          {role === "STUDENT" && (
            <input type="number" step="0.01" placeholder="CPI" required className="w-full border p-2 rounded" onChange={(e) => setFormData({ ...formData, cpi: e.target.value })} />
          )}

          <input type="password" placeholder="Password" required className="w-full border p-2 rounded" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <input type="password" placeholder="Confirm Password" required className="w-full border p-2 rounded" onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />

          <button className="w-full bg-blue-600 text-white py-2 rounded">Register</button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account? <Link to="/signin" className="text-blue-600 font-bold">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;


import React, { useState } from "react";
import { Link, useNavigate } from "react-router";

export default function SignUp() {
  const [role, setRole] = useState("STUDENT");
  const [formData, setFormData] = useState({
    name: "", email: "", mobile: "", password: "", confirmPassword: "", cpi: ""
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return alert("Passwords mismatch!");

    const res = await fetch("http://localhost:8080/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        role,
        cpi: formData.cpi ? parseFloat(formData.cpi) : null
      }),
    });

    const msg = await res.text();
    if (msg === "SUCCESS") {
      alert("Registration Successful!");
      navigate("/signin");
    } else {
      alert(msg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      {/* Card Container */}
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">

        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-6 tracking-tight">
          Create Account
        </h2>

        {/* Role Toggle Switch */}
        <div className="flex bg-gray-100 p-1.5 rounded-xl mb-6 shadow-inner">
          <button
            type="button"
            onClick={() => setRole("STUDENT")}
            className={`flex-1 py-2 rounded-lg transition-all duration-200 font-bold ${role === "STUDENT" ? "bg-white shadow-md text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole("TPO")}
            className={`flex-1 py-2 rounded-lg transition-all duration-200 font-bold ${role === "TPO" ? "bg-white shadow-md text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            TPO
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email (@ddu.ac.in)"
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />

          {/* Mobile */}
          <input
            type="text"
            placeholder="Mobile Number"
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            onChange={(e) => setFormData({...formData, mobile: e.target.value})}
          />

          {/* Conditional CPI Field */}
          {role === "STUDENT" && (
            <input
              type="number"
              step="0.01"
              placeholder="Current CPI"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              onChange={(e) => setFormData({...formData, cpi: e.target.value})}
            />
          )}

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-all shadow-md active:scale-95 mt-2"
          >
            Register Now
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/signin" className="font-bold text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
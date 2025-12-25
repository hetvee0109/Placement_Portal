import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [isForgot, setIsForgot] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isForgot ? "forgot-password" : "signin";
    const payload = isForgot ? { email, newPassword } : { email, password, role };

    try {
      const res = await fetch(`http://localhost:8080/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const message = await res.text();

      if (res.ok && message === "SUCCESS") {
        if (isForgot) {
          alert("Password updated successfully! Please login.");
          setIsForgot(false);
          setNewPassword("");
        } else {
          localStorage.setItem("userEmail", email);
          localStorage.setItem("userRole", role);
          alert("Login Successful!");
          navigate(role === "TPO" ? "/tpo-dashboard" : "/student-dashboard");
        }
      } else {
        alert(message || "Operation failed");
      }
    } catch (err) {
      alert("Cannot connect to server. Please check if Spring Boot is running on port 8080.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      {/* Card Container */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-2xl rounded-2xl border border-gray-100">

        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center text-blue-600 tracking-tight">
          {isForgot ? "Reset Password" : "Sign In"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">DDU Email</label>
            <input
              type="email"
              placeholder="name.stu@ddu.ac.in"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {!isForgot ? (
            <>
              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Role Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Login As</label>
                <select
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="STUDENT">Student</option>
                  <option value="TPO">TPO</option>
                </select>
              </div>
            </>
          ) : (
            /* New Password Input for Forgot Flow */
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                placeholder="Enter New Password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={newPassword}
                required
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-md hover:shadow-lg"
          >
            {isForgot ? "Update Password" : "Login to Portal"}
          </button>
        </form>

        {/* Links Section */}
        <div className="text-center pt-2 space-y-3">
          <button
            type="button"
            onClick={() => {
              setIsForgot(!isForgot);
              setNewPassword("");
            }}
            className="text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors"
          >
            {isForgot ? "← Back to Login" : "Forgot Password?"}
          </button>

          <div className="h-px bg-gray-200 w-full"></div>

          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="font-bold text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
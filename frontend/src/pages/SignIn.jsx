import React, { useState } from "react";
import { Link, useNavigate } from "react-router"; // make sure it's 'react-router-dom'

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [isForgot, setIsForgot] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ CLIENT-SIDE VALIDATIONS
    if (!email.trim()) {
      alert("Email is required!");
      return;
    }

    // Optional: DDU email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@ddu\.ac\.in$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid DDU email!");
      return;
    }

    if (isForgot) {
      if (!newPassword.trim()) {
        alert("New password cannot be empty!");
        return;
      }
    } else {
      if (!password.trim()) {
        alert("Password is required!");
        return;
      }
      if (!role) {
        alert("Please select a role!");
        return;
      }
    }

    // 🔥 PREPARE PAYLOAD
    const endpoint = isForgot ? "forgot-password" : "signin";
    const payload = isForgot
      ? { email, newPassword }
      : { email, password, role };

    try {
      const res = await fetch(`http://localhost:8080/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = isForgot ? await res.text() : await res.json();

      if (isForgot) {
        if (res.ok && data.toLowerCase().includes("success")) {
          alert("Password updated successfully! Please login.");
          setIsForgot(false);
          setNewPassword("");
        } else {
          alert(data);
        }
        return;
      }

      // 🔥 LOGIN FLOW
      if (data.status === "success") {
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userRole", data.role);

        if (data.role === "STUDENT") {
          navigate("/student-dashboard");
        } else if (data.role === "TPO") {
          navigate("/tpo-dashboard");
        }
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Cannot connect to server. Please ensure backend is running.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-2xl rounded-2xl border border-gray-100">
        <h2 className="text-3xl font-extrabold text-center text-blue-600">
          {isForgot ? "Reset Password" : "Sign In"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="name.stu@ddu.ac.in"
            required
            className="w-full px-4 py-2.5 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {!isForgot ? (
            <>
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full px-4 py-2.5 border rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <select
                className="w-full px-4 py-2.5 border rounded-lg"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="STUDENT">Student</option>
                <option value="TPO">TPO</option>
              </select>
            </>
          ) : (
            <input
              type="password"
              placeholder="New Password"
              required
              className="w-full px-4 py-2.5 border rounded-lg"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          )}

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">
            {isForgot ? "Update Password" : "Login"}
          </button>
        </form>

        <button
          onClick={() => {
            setIsForgot(!isForgot);
            setNewPassword("");
          }}
          className="text-sm text-blue-500 font-semibold"
        >
          {isForgot ? "← Back to Login" : "Forgot Password?"}
        </button>

        <p className="text-sm text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-bold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}


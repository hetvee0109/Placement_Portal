import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  // --- Original Login States ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const navigate = useNavigate();

  // --- Forgot Password / OTP States ---
  const [isForgot, setIsForgot] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // --- Regex for DDU Email ---
  const emailRegex = /^[a-zA-Z0-9._%+-]+@ddu\.ac\.in$/;

  // --- Helper: Send OTP ---
  const handleSendOtp = async () => {
    if (!emailRegex.test(email)) {
      alert("Please enter a valid DDU email!");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        alert("OTP sent successfully to " + email);
        setStep(2);
      } else {
        const msg = await res.text();
        alert(msg);
      }
    } catch (err) {
      alert("Backend server is not reachable");
    }
  };

  // --- Helper: Verify OTP ---
  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
      alert("Please enter the 4-digit OTP");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      if (res.ok) {
        setStep(3);
      } else {
        alert("Invalid or Expired OTP");
      }
    } catch (err) {
      alert("Verification error");
    }
  };

  // --- Main Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Common Email Validation
    if (!email.trim()) {
      alert("Email is required!");
      return;
    }

    // BRANCH A: FORGOT PASSWORD FLOW
    if (isForgot) {
      if (step === 1) return handleSendOtp();
      if (step === 2) return handleVerifyOtp();
      if (step === 3) {
        if (!newPassword.trim()) {
          alert("New password cannot be empty!");
          return;
        }
        try {
          const res = await fetch("http://localhost:8080/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password: newPassword }),
          });
          if (res.ok) {
            alert("Password updated! You can now login.");
            setIsForgot(false);
            setStep(1);
            setNewPassword("");
            setOtp("");
          }
        } catch (err) { alert("Reset failed"); }
        return;
      }
    } else {
      // BRANCH B: ORIGINAL LOGIN FLOW
      if (!emailRegex.test(email)) {
        alert("Please enter a valid DDU email!");
        return;
      }
      if (!password.trim()) {
        alert("Password is required!");
        return;
      }

      try {
        const res = await fetch(`http://localhost:8080/api/auth/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, role }),
        });

        const data = await res.json();

        if (data.status === "success") {
          // Exact original localStorage logic preserved
          localStorage.clear();
          localStorage.setItem("userId", data.id);
          localStorage.setItem("userName", data.name);
          localStorage.setItem("userEmail", data.email);
          localStorage.setItem("userRole", data.role);

          // Redirecting based on role as per your original file
          if (data.role === "STUDENT") {
            window.location.href = "/student-dashboard";
          } else {
            window.location.href = "/tpo-dashboard";
          }
        } else {
          alert(data.message || "Invalid Email or Password");
        }
      } catch (err) {
        alert("Cannot connect to server. Check backend console.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-2xl rounded-2xl border border-gray-100">
        <h2 className="text-3xl font-extrabold text-center text-blue-600">
          {isForgot ? (step === 1 ? "Forgot Password" : step === 2 ? "Verify OTP" : "New Password") : "Sign In"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="name.stu@ddu.ac.in"
            required
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none ${isForgot && step > 1 ? "bg-gray-100 cursor-not-allowed" : ""}`}
            value={email}
            readOnly={isForgot && step > 1}
            onChange={(e) => setEmail(e.target.value)}
          />

          {!isForgot ? (
            <>
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <select
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="STUDENT">Student</option>
                <option value="TPO">TPO</option>
              </select>
            </>
          ) : (
            <>
              {step === 2 && (
                <div className="space-y-2">
                  <p className="text-xs text-center text-gray-500">Check your email for the 4-digit OTP</p>
                  <input
                    type="text"
                    placeholder="0000"
                    required
                    maxLength="4"
                    className="w-full px-4 py-2.5 border-2 border-blue-400 rounded-lg text-center text-2xl font-bold tracking-[0.5em] outline-none"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              )}
              {step === 3 && (
                <input
                  type="password"
                  placeholder="Enter New Password"
                  required
                  className="w-full px-4 py-2.5 border-2 border-green-500 rounded-lg outline-none"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              )}
            </>
          )}

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg active:scale-95">
            {isForgot ? (step === 1 ? "Send OTP" : step === 2 ? "Verify OTP" : "Update Password") : "Login"}
          </button>
        </form>

        <div className="flex flex-col items-center space-y-4 pt-2">
          <button
            onClick={() => {
              setIsForgot(!isForgot);
              setStep(1);
              setOtp("");
              setNewPassword("");
            }}
            className="text-sm text-blue-500 font-semibold hover:underline"
          >
            {isForgot ? "← Back to Login" : "Forgot Password?"}
          </button>

          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-bold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
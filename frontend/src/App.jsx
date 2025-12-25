import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import "./App.css";
import "./index.css"

// Auth Pages - Located in src/pages/
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

// Student Pages - Located in src/pages/Student/
import StudentDashboard from "./pages/Student/StudentDashboard";
import Profile from "./pages/Student/Profile";
import PlacementStatus from "./pages/Student/PlacementStatus";

// TPO Pages - Located in src/pages/TPO/
import TPODashboard from "./pages/TPO/TPODashboard";
import StudentManagement from "./pages/TPO/StudentManagement";
import ApplicationTracker from "./pages/TPO/ApplicationTracker";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const userRole = localStorage.getItem("userRole");
  const userEmail = localStorage.getItem("userEmail");

  if (!userEmail) return <Navigate to="/signin" />;
  if (allowedRole && userRole !== allowedRole) return <Navigate to="/signin" />;

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Student Protected Routes */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={<ProtectedRoute allowedRole="STUDENT"><Profile /></ProtectedRoute>}
        />
        <Route
          path="/student/placement-status"
          element={<ProtectedRoute allowedRole="STUDENT"><PlacementStatus /></ProtectedRoute>}
        />

        {/* TPO Protected Routes */}
        <Route
          path="/tpo-dashboard"
          element={
            <ProtectedRoute allowedRole="TPO">
              <TPODashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tpo/manage-students"
          element={<ProtectedRoute allowedRole="TPO"><StudentManagement /></ProtectedRoute>}
        />
        <Route
          path="/tpo/application-tracker"
          element={<ProtectedRoute allowedRole="TPO"><ApplicationTracker /></ProtectedRoute>}
        />

        {/* Default Redirects */}
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
}

export default App;
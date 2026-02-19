import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import "./App.css";

/* ================= AUTH PAGES ================= */
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

/* ================= NAVBARS ================= */
import StudentNavbar from "./pages/Student/StudentNavbar";
import TpoNavbar from "./pages/TPO/TpoNavbar";

/* ================= STUDENT PAGES ================= */
import StudentDashboard from "./pages/Student/Dashboard";
import Profile from "./pages/Student/Profile";
import Notifications from "./pages/Student/Notifications";
import JobApplications from "./pages/Student/JobApplications";
import AboutTPO from "./pages/Student/AboutTPO";

/* ================= TPO PAGES ================= */
import TPODashboard from "./pages/TPO/Dashboard"; // ✅ FIXED NAME
import StudentManagement from "./pages/TPO/StudentManagement";
import ResumeInsights from "./pages/TPO/ResumeInsights";
import ApplicationTracker from "./pages/TPO/ApplicationTracker";
import PlacementSummary from "./pages/TPO/PlacementSummary";
import TPONotifications from "./pages/TPO/Notifications";

/* ================= PROTECTED ROUTE ================= */
const ProtectedRoute = ({ allowedRole }) => {
  const userRole = localStorage.getItem("userRole");
  const userEmail = localStorage.getItem("userEmail");

  if (!userEmail) return <Navigate to="/signin" replace />;
  if (allowedRole && userRole !== allowedRole)
    return <Navigate to="/signin" replace />;

  return <Outlet />;
};

/* ================= LAYOUT ================= */
const Layout = ({ isTpo }) => (
  <>
    {isTpo ? <TpoNavbar /> : <StudentNavbar />}

    <main className="mt-[60px] px-10 py-6 bg-blue-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm p-6 min-h-full">
        <Outlet />
      </div>
    </main>
  </>
);

/* ================= MAIN APP ================= */
function App() {
  const userId = localStorage.getItem("userId");

  return (
    <Router>
      <Routes>
        {/* ========= PUBLIC ========= */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* ========= STUDENT ========= */}
        <Route element={<ProtectedRoute allowedRole="STUDENT" />}>
          <Route element={<Layout isTpo={false} />}>
            <Route
              path="/student-dashboard"
              element={<StudentDashboard userId={userId} />}
            />
            <Route path="/student/profile" element={<Profile />} />
            <Route path="/student/notifications" element={<Notifications />} />
            <Route path="/student/jobs" element={<JobApplications />} />
            <Route path="/student/about-tpo" element={<AboutTPO />} />
            <Route
              path="/student/placement-status"
              element={<JobApplications />}
            />
          </Route>
        </Route>

        {/* ========= TPO ========= */}
        <Route element={<ProtectedRoute allowedRole="TPO" />}>
          <Route element={<Layout isTpo={true} />}>
            <Route path="/tpo-dashboard" element={<TPODashboard />} />
            <Route
              path="/tpo/manage-students"
              element={<StudentManagement />}
            />
            <Route
              path="/tpo/resume-insights"
              element={<ResumeInsights />}
            />
            <Route
              path="/tpo/application-tracker"
              element={<ApplicationTracker />}
            />
            <Route
              path="/tpo/result-portal"
              element={<PlacementSummary />}
            />
            <Route
              path="/tpo/placement-summary"
              element={<PlacementSummary />}
            />
            <Route
              path="/tpo/notifications"
              element={<TPONotifications />}
            />
          </Route>
        </Route>

        {/* ========= DEFAULT ========= */}
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;




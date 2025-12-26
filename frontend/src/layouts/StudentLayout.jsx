import StudentNavbar from "../components/StudentNavbar";
import { Outlet } from "react-router-dom";

const StudentLayout = () => {
  return (
    <>
      <StudentNavbar />
      <main className="mt-[60px] px-6 py-4 bg-blue-50 min-h-screen">
        <Outlet />
      </main>
    </>
  );
};

export default StudentLayout;

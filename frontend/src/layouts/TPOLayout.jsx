import TpoNavbar from "../components/TpoNavbar";
import { Outlet } from "react-router-dom";

const TPOLayout = () => {
  return (
    <>
      <TpoNavbar />
      <main className="mt-[60px] px-6 py-4 bg-blue-50 min-h-screen">
        <Outlet />
      </main>
    </>
  );
};

export default TPOLayout;

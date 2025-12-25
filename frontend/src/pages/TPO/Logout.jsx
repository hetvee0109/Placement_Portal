import { useEffect } from "react";

const handleLogout = () => {
  localStorage.removeItem("role");
  navigate("/");
};


export default Logout;

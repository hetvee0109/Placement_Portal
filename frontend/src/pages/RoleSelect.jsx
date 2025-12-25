function RoleSelect({ setRole }) {
  const selectRole = (role) => {
    localStorage.setItem("role", role);
    setRole(role); // 🔥 triggers re-render
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-blue-50">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Select Your Role
      </h1>

      <div className="flex gap-6">
        <button
          onClick={() => selectRole("student")}
          className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800"
        >
          Student
        </button>

        <button
          onClick={() => selectRole("tpo")}
          className="bg-white border-2 border-blue-700 text-blue-700 px-6 py-3 rounded-lg hover:bg-blue-100"
        >
          TPO
        </button>
      </div>
    </div>
  );
}

export default RoleSelect;

// src/pages/Dashboard.jsx
const Dashboard = () => (
  <div className="pt-[80px] p-6">
    <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-4 bg-blue-50 rounded shadow">Total Students: 120</div>
      <div className="p-4 bg-blue-50 rounded shadow">Placed Students: 75</div>
      <div className="p-4 bg-blue-50 rounded shadow">Pending Applications: 45</div>
    </div>
  </div>
);
export default Dashboard;

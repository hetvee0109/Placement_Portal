// src/pages/PlacementSummary.jsx
const PlacementSummary = () => (
  <div className="pt-[80px] p-6">
    <h1 className="text-2xl font-bold mb-4">Placement Summary</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-4 bg-blue-50 rounded shadow">Total Students: 120</div>
      <div className="p-4 bg-blue-50 rounded shadow">Placed Students: 75</div>
      <div className="p-4 bg-blue-50 rounded shadow">Companies Visited: 20</div>
    </div>
  </div>
);
export default PlacementSummary;

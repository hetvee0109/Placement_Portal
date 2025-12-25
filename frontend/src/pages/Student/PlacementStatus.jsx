function PlacementStatus() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-blue-700 mb-6">
        Placement Status
      </h1>

      <div className="border rounded-xl p-6 bg-blue-50">
        <p className="text-gray-700 mb-2">
          <strong>Current Status:</strong> Placed
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Company:</strong> Infosys
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Role:</strong> System Engineer
        </p>
        <p className="text-gray-700">
          <strong>Package:</strong> ₹3.6 LPA
        </p>
      </div>
    </div>
  );
}

export default PlacementStatus;

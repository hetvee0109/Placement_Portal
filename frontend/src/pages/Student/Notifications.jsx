function Notifications() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-blue-700 mb-6">
        Notifications
      </h1>

      <div className="space-y-4">
        <div className="border rounded-lg p-4 hover:bg-blue-50">
          <p className="font-medium">Resume shortlisted for Infosys</p>
          <p className="text-sm text-gray-500">2 hours ago</p>
        </div>

        <div className="border rounded-lg p-4 hover:bg-blue-50">
          <p className="font-medium">TCS aptitude test details released</p>
          <p className="text-sm text-gray-500">Yesterday</p>
        </div>

        <div className="border rounded-lg p-4 hover:bg-blue-50">
          <p className="font-medium">Capgemini interview schedule announced</p>
          <p className="text-sm text-gray-500">2 days ago</p>
        </div>
      </div>
    </div>
  );
}

export default Notifications;


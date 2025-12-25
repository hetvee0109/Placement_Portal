function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-blue-700 mb-2">
        Dashboard
      </h1>
      <p className="text-gray-600 mb-6">
        Overview of your placement activities and current status.
      </p>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Applications Submitted</p>
          <p className="text-3xl font-bold text-blue-700 mt-2">5</p>
        </div>

        <div className="bg-blue-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Shortlisted</p>
          <p className="text-3xl font-bold text-blue-700 mt-2">2</p>
        </div>

        <div className="bg-blue-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Offers Received</p>
          <p className="text-3xl font-bold text-blue-700 mt-2">1</p>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6">
        <h2 className="font-semibold text-blue-700 mb-3">
          Latest Updates
        </h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>TCS aptitude test scheduled on 25 March</li>
          <li>Infosys resume shortlisting completed</li>
          <li>Capgemini technical interview results awaited</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;

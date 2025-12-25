function JobApplications() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-blue-700 mb-6">
        Job Applications
      </h1>

      <div className="space-y-4">
        <div className="border rounded-lg p-4 flex justify-between">
          <div>
            <p className="font-medium">TCS</p>
            <p className="text-sm text-gray-500">Software Engineer</p>
          </div>
          <span className="text-blue-700 font-medium">Applied</span>
        </div>

        <div className="border rounded-lg p-4 flex justify-between">
          <div>
            <p className="font-medium">Infosys</p>
            <p className="text-sm text-gray-500">System Engineer</p>
          </div>
          <span className="text-green-600 font-medium">Shortlisted</span>
        </div>

        <div className="border rounded-lg p-4 flex justify-between">
          <div>
            <p className="font-medium">Capgemini</p>
            <p className="text-sm text-gray-500">Analyst</p>
          </div>
          <span className="text-yellow-600 font-medium">Interview Scheduled</span>
        </div>
      </div>
    </div>
  );
}

export default JobApplications;

function AboutTPO() {
  return (
    <div className="max-w-5xl mx-auto space-y-10">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl p-8 shadow-md">
        <h1 className="text-3xl font-semibold mb-2">
          Training & Placement Cell
        </h1>
        <p className="text-blue-100 text-sm">
          Dharmsinh Desai University – Career Development & Placements
        </p>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          About the Cell
        </h2>
        <p className="text-gray-600 leading-relaxed">
          The Training and Placement Cell (TPO) of Dharmsinh Desai University
          is committed to preparing students for professional excellence by
          aligning academic learning with industry expectations.
        </p>
        <p className="text-gray-600 leading-relaxed mt-4">
          The cell actively collaborates with reputed organizations to facilitate
          internships, placements, and training programs that enhance students’
          employability and career readiness.
        </p>
      </div>

      {/* Vision & Mission */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">
            Vision
          </h3>
          <p className="text-gray-600 leading-relaxed">
            To empower students with professional skills, confidence, and
            industry exposure that enable them to build successful careers.
          </p>
        </div>

        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">
            Mission
          </h3>
          <p className="text-gray-600 leading-relaxed">
            To provide structured training, career guidance, and placement
            opportunities through continuous industry engagement.
          </p>
        </div>
      </div>

      {/* Responsibilities */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          Key Responsibilities
        </h2>

        <ul className="grid grid-cols-2 gap-4 text-gray-600">
          <li className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            Organizing campus placement & internship drives
          </li>
          <li className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            Coordinating recruitment processes with companies
          </li>
          <li className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            Conducting resume & interview preparation sessions
          </li>
          <li className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            Offering career guidance & professional mentoring
          </li>
        </ul>
      </div>

      {/* Student Support */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          Student Support & Guidance
        </h2>
        <p className="text-gray-600 leading-relaxed">
          The Training and Placement Cell supports students throughout their
          academic journey by providing career counseling, skill development
          resources, and guidance to help them make informed career decisions
          and succeed in recruitment processes.
        </p>
      </div>

      {/* Contact Card */}
      <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          Contact Information
        </h2>

        <div className="grid grid-cols-2 gap-6 text-gray-700">
          <div>
            <p className="font-medium">Training & Placement Officer</p>
            <p className="text-gray-600">Prof. A. K. Mehta</p>
          </div>

          <div>
            <p className="font-medium">Email</p>
            <p className="text-gray-600">tpo@ddu.ac.in</p>
          </div>

          <div>
            <p className="font-medium">Office Location</p>
            <p className="text-gray-600">
              Academic Block – II, First Floor
            </p>
          </div>

          <div>
            <p className="font-medium">Office Hours</p>
            <p className="text-gray-600">
              Monday – Friday, 10:00 AM – 5:00 PM
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default AboutTPO;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const StudentDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Pull fresh ID from storage for every render
        const activeId = localStorage.getItem("userId");

        if (activeId && activeId !== "undefined") {
            setLoading(true);
            // Dynamic URL based on logged-in ID
            axios.get(`http://localhost:8080/api/students/dashboard/student/${activeId}`)
                .then(res => {
                    setData(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Fetch Error:", err);
                    setError("Failed to load dashboard.");
                    setLoading(false);
                });
        } else {
            setError("No session found. Please login.");
            setLoading(false);
        }
    }, []); // Empty array is fine here because window.location.href reloads the component

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-64 animate-pulse">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-bold">Loading Profile...</p>
        </div>
    );

    if (error) return (
        <div className="p-10 text-center text-red-600 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="mx-auto mb-2" />
            <p className="font-bold">{error}</p>
        </div>
    );

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {data.name}!</h1>


            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard icon={<Briefcase />} label="Applied" value={data.appliedCount} color="blue" />
                <StatCard icon={<Clock />} label="Pending" value={data.pendingCount} color="yellow" />
                <StatCard icon={<CheckCircle />} label="Offers" value={data.offersCount} color="green" />
            </div>

            {/* Applications Table */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4 text-gray-700">Recent Applications</h2>
                <div className="border rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
                            <tr>
                                <th className="p-4">Company</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.applications && data.applications.length > 0 ? (
                                data.applications.map((app, index) => (
                                    <tr key={index} className="hover:bg-blue-50/50 transition-all">
                                        <td className="p-4 font-bold text-blue-900">{app.companyName}</td>
                                        <td className="p-4 text-gray-600">{app.date}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                                                app.status === 'SELECTED' ? 'bg-green-100 text-green-700' :
                                                app.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="p-10 text-center text-gray-400 font-medium italic">
                                        No applications yet. Go to Job Drives to apply!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => {
    const theme = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
        green: "bg-green-50 text-green-600 border-green-100"
    };
    return (
        <div className={`p-5 rounded-2xl border-2 flex items-center gap-5 shadow-sm transition-transform hover:scale-[1.02] ${theme[color]}`}>
            <div className="bg-white p-4 rounded-xl shadow-inner">{icon}</div>
            <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-70">{label}</p>
                <p className="text-3xl font-black text-gray-800">{value}</p>
            </div>
        </div>
    );
};

export default StudentDashboard;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, UserCheck, UserX, Building2 } from 'lucide-react';

const TPODashboard = () => {
    const [data, setData] = useState(null);
    const COLORS = ['#10b981', '#ef4444']; // Green for Placed, Red for Unplaced

    useEffect(() => {
        axios.get('http://localhost:8080/api/students/dashboard/tpo')
            .then(res => setData(res.data))
            .catch(err => console.error("Error loading TPO stats", err));
    }, []);

    if (!data) return (
        <div className="flex items-center justify-center h-screen bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">TPO Analytics Dashboard</h1>
                <p className="text-slate-500 font-medium">Monitoring placement health across all departments.</p>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard icon={<Users className="text-blue-600"/>} label="Total Students" value={data.totalStudents} />
                <StatCard icon={<UserCheck className="text-emerald-600"/>} label="Placed Students" value={data.placedCount} />
                <StatCard icon={<UserX className="text-red-600"/>} label="Unplaced" value={data.unplacedCount} />
                <StatCard icon={<Building2 className="text-purple-600"/>} label="Total Companies" value={data.totalCompanies} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold mb-6 text-slate-700">Placement Ratio</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={data.chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {data.chartData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex justify-center gap-4 text-sm font-semibold">
                        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500 rounded-full"></span> Placed</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-full"></span> Unplaced</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center text-center">
                    <h2 className="text-5xl font-black text-indigo-600 mb-2">
                        {((data.placedCount / data.totalStudents) * 100).toFixed(1)}%
                    </h2>
                    <p className="text-slate-400 uppercase tracking-widest font-bold">Total Placement Rate</p>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
        <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
        <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{label}</p>
            <p className="text-2xl font-black text-slate-800">{value}</p>
        </div>
    </div>
);

export default TPODashboard;
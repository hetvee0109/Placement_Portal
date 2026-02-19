import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';
import { Users, UserCheck, UserX, Building2, TrendingUp, Award } from 'lucide-react';

const TPODashboard = () => {
    const [data, setData] = useState(null);
    const COLORS = ['#10b981', '#ef4444'];

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

    // Helper to check if arrays exist and have data
    const hasMonthlyData = data?.monthlyData && data.monthlyData.length > 0;
    const hasCompanyData = data?.companyData && data.companyData.length > 0;

    return (
        <div className="p-8 bg-slate-50 min-h-screen font-sans">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">TPO Analytics Dashboard</h1>
                    <p className="text-slate-500 font-medium">Real-time placement performance & hiring trends.</p>
                </div>
                <div className="hidden md:block bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-indigo-200">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Current Status</p>
                    <p className="text-lg font-bold">Academic Year 2025-26</p>
                </div>
            </header>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard icon={<Users size={24}/>} color="blue" label="Total Students" value={data.totalStudents} />
                <StatCard icon={<UserCheck size={24}/>} color="emerald" label="Placed Students" value={data.placedCount} />
                <StatCard icon={<UserX size={24}/>} color="red" label="Unplaced" value={data.unplacedCount} />
                <StatCard icon={<Building2 size={24}/>} color="purple" label="Unique Companies" value={data.totalCompanies} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 1. Placement Ratio (Pie) */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center">
                    <h3 className="text-lg font-bold self-start text-slate-800 mb-2">Success Distribution</h3>
                    {/* Fixed Height Wrapper */}
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={data.chartData} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none">
                                    {data.chartData?.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="text-center mt-4">
                        <p className="text-5xl font-black text-slate-900">
                            {data.totalStudents > 0 ? ((data.placedCount / data.totalStudents) * 100).toFixed(1) : 0}%
                        </p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Placement Velocity</p>
                    </div>
                </div>

                {/* 2. Hiring Trends (Area Chart) */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                        <TrendingUp className="text-indigo-500" /> Monthly Hiring Trend
                    </h3>
                    {/* Fixed Height Wrapper resolves console errors */}
                    <div className="h-72 w-full">
                        {hasMonthlyData ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.monthlyData}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-300 italic">No trend data available</div>
                        )}
                    </div>
                </div>

                {/* 3. Top Companies (Bar Chart) */}
                <div className="lg:col-span-3 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Award className="text-amber-500" /> Top Hiring Partners
                    </h3>
                    {/* Fixed Height Wrapper resolves console errors */}
                    <div className="h-80 w-full">
                        {hasCompanyData ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.companyData} layout="vertical" margin={{ left: 40, right: 40 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontWeight: 600, fontSize: 13}} />
                                    <Tooltip cursor={{fill: 'transparent'}} />
                                    <Bar dataKey="count" fill="#6366f1" radius={[0, 10, 10, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-300 italic">No recruiter data available</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => {
    const colors = {
        blue: "bg-blue-50 text-blue-600 shadow-blue-100",
        emerald: "bg-emerald-50 text-emerald-600 shadow-emerald-100",
        red: "bg-red-50 text-red-600 shadow-red-100",
        purple: "bg-purple-50 text-purple-600 shadow-purple-100"
    };

    return (
        <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${colors[color]}`}>
                {icon}
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
        </div>
    );
};

// CRITICAL: This export default fixes the SyntaxError in App.jsx
export default TPODashboard;
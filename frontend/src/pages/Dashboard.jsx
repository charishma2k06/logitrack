import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const getStatusColor = (status) => {
    switch (status) {
        case 'In Transit': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
        case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'Out for Delivery': return 'bg-purple-100 text-purple-800 border-purple-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const EmptyState = ({ message }) => (
    <tr>
        <td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">{message}</td>
    </tr>
);

const AdminDashboard = ({ shipments, loading, analyticsData }) => {
    const inTransit = shipments.filter(s => s.status === 'In Transit').length;
    const delivered = shipments.filter(s => s.status === 'Delivered').length;
    const pending = shipments.filter(s => s.status === 'Pending').length;
    const recentShipments = shipments.slice(0, 5);

    const stats = [
        { name: 'Global Shipments', value: shipments.length.toString(), change: '+12%', icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3', color: 'indigo' },
        { name: 'Active Fleet', value: inTransit.toString(), change: '+4.5%', icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'blue' },
        { name: 'Delivered', value: delivered.toString(), change: '+18.2%', icon: 'M5 13l4 4L19 7', color: 'green' },
        { name: 'Pending Review', value: pending.toString(), change: '-2.1%', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'yellow' }
    ];

    if (loading) return <div className="p-8 text-center text-indigo-500 font-medium tracking-wide">Loading Operational Analytics...</div>;

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Executive Dashboard</h2>
                <p className="mt-1 text-sm text-gray-500 font-medium">Your global logistics network performance at a glance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-xl transition-all transform hover:-translate-y-1 relative overflow-hidden group">
                        <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${stat.color}-500 rounded-full mix-blend-multiply filter blur-2xl opacity-10 group-hover:opacity-30 transition-opacity`}></div>
                        <div className="flex items-center mb-4">
                            <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 mr-4 shadow-inner`}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon}></path>
                                </svg>
                            </div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.name}</p>
                        </div>
                        <div className="flex items-baseline space-x-2">
                            <h3 className="text-4xl font-black text-gray-900">{stat.value}</h3>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-lg shadow-indigo-100/50 border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-2 h-6 bg-indigo-500 rounded mr-3"></span>
                        Volume Over Time
                    </h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analyticsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorShipments" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                                <Area type="monotone" dataKey="shipments" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorShipments)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg shadow-emerald-100/50 border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-2 h-6 bg-emerald-500 rounded mr-3"></span>
                        Weekly Revenue Generation
                    </h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analyticsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                                <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900">Recent Network Activity</h3>
                    <button className="text-sm text-indigo-600 font-bold hover:text-indigo-800 transition">View Full Ledger &rarr;</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-gray-100 text-sm">
                                <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-xs">Tracking ID</th>
                                <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-xs">Client</th>
                                <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-xs">Destination</th>
                                <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-xs text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentShipments.map((shipment) => (
                                <tr key={shipment._id || shipment.shipmentId} className="hover:bg-indigo-50/30 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-bold text-indigo-900 group-hover:text-indigo-600 transition-colors">{shipment.shipmentId}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{shipment.customer?.name || 'Unknown User'}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600 flex items-center">
                                        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        {shipment.destination}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right">
                                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${getStatusColor(shipment.status)}`}>
                                            {shipment.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {recentShipments.length === 0 && <EmptyState message="No network activity detected." />}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const CustomerDashboard = ({ shipments, loading }) => {
    const active = shipments.filter(s => s.status === 'In Transit' || s.status === 'Out for Delivery').length;
    const delivered = shipments.filter(s => s.status === 'Delivered').length;
    const recentShipments = shipments.slice(0, 4);

    if (loading) return <div className="p-8 text-center text-orange-500 font-medium tracking-wide">Securely loading your shipments...</div>;

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="bg-gradient-to-r from-orange-400 to-rose-500 rounded-3xl p-8 text-white shadow-2xl shadow-orange-200 flex justify-between items-center relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl font-black tracking-tight mb-2">Welcome Back!</h2>
                    <p className="text-orange-50 text-lg font-medium max-w-md">Track, manage, and book your incoming deliveries directly from your personalized portal.</p>
                    <button className="mt-6 bg-white text-orange-600 px-6 py-2.5 rounded-full font-bold shadow hover:bg-orange-50 transition transform hover:-translate-y-0.5">
                        Track a Package
                    </button>
                </div>
                <div className="hidden lg:flex relative z-10 bg-white/20 p-6 rounded-2xl backdrop-blur-md border border-white/30 text-center flex-col items-center justify-center min-w-[200px]">
                    <span className="text-5xl font-black mb-1">{active}</span>
                    <span className="text-sm font-bold uppercase tracking-widest text-orange-100">Active Deliveries</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900">Total Booked</h3>
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg></div>
                    </div>
                    <span className="text-4xl font-black text-gray-800">{shipments.length}</span>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900">Successfully Delivered</h3>
                        <div className="p-2 bg-green-50 rounded-lg text-green-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                    </div>
                    <span className="text-4xl font-black text-gray-800">{delivered}</span>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900">My Recent Orders</h3>
                    <button className="text-sm text-orange-500 font-bold hover:text-orange-600 transition">View All &rarr;</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-gray-100 text-sm">
                                <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-xs">Tracking Number</th>
                                <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-xs">Destination</th>
                                <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-xs text-right">Live Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentShipments.map((shipment) => (
                                <tr key={shipment._id || shipment.shipmentId} className="hover:bg-orange-50/30 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{shipment.shipmentId}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{shipment.destination}</td>
                                    <td className="px-6 py-4 text-sm text-right">
                                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${getStatusColor(shipment.status)}`}>
                                            {shipment.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {recentShipments.length === 0 && <EmptyState message="You have no recent orders." />}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const DriverDashboard = ({ shipments, loading }) => {
    const toPickUp = shipments.filter(s => s.status === 'Pending' || s.status === 'Confirmed').length;
    const activeRoute = shipments.filter(s => s.status === 'In Transit' || s.status === 'Out for Delivery').length;
    const completedToday = shipments.filter(s => s.status === 'Delivered').length; // simplified

    if (loading) return <div className="p-8 text-center text-cyan-500 font-medium tracking-wide">Syncing route data...</div>;

    return (
        <div className="space-y-6 animate-fade-in-up max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-3xl p-6 text-white shadow-xl flex items-center justify-between border-l-8 border-cyan-400">
                <div>
                    <span className="text-cyan-400 font-bold tracking-widest text-xs uppercase mb-1 block">Duty Status</span>
                    <h2 className="text-2xl font-black">Ready for Deployment</h2>
                </div>
                <button className="bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-black px-6 py-3 rounded-xl transition shadow-lg shadow-cyan-500/30 transform hover:-translate-y-0.5">
                    START ROUTE
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-200 text-center shadow-sm">
                    <span className="block text-4xl font-black text-gray-800 mb-1">{toPickUp}</span>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pending Pickups</span>
                </div>
                <div className="bg-cyan-50 rounded-2xl p-5 border border-cyan-100 text-center shadow-sm">
                    <span className="block text-4xl font-black text-cyan-700 mb-1">{activeRoute}</span>
                    <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest">In Transit</span>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-200 text-center shadow-sm">
                    <span className="block text-4xl font-black text-gray-800 mb-1">{completedToday}</span>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Completed</span>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 pt-5 overflow-hidden">
                <h3 className="text-lg font-black text-gray-900 px-6 mb-4">Urgent Assignments</h3>
                <div className="divide-y divide-gray-100">
                    {shipments.filter(s => s.status === 'In Transit' || s.status === 'Out for Delivery').slice(0, 3).map((shipment) => (
                        <div key={shipment._id || shipment.shipmentId} className="p-6 hover:bg-gray-50 transition flex items-center justify-between">
                            <div>
                                <div className="flex items-center mb-1">
                                    <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-md mr-2 uppercase">Priority</span>
                                    <span className="font-bold text-gray-900">{shipment.shipmentId}</span>
                                </div>
                                <p className="text-sm font-medium text-gray-500 flex items-center mt-2">
                                    <svg className="w-4 h-4 mr-1 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path></svg>
                                    To: {shipment.destination}
                                </p>
                            </div>
                            <button className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-cyan-200 text-cyan-600 flex items-center justify-center hover:bg-cyan-50 transition">
                                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </button>
                        </div>
                    ))}
                    {shipments.filter(s => s.status === 'In Transit' || s.status === 'Out for Delivery').length === 0 && (
                        <div className="p-8 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3 text-gray-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <p className="text-gray-500 font-bold">You have no active runs right now.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function Dashboard({ userRole }) {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);

    const analyticsData = [
        { name: 'Mon', revenue: 4000, shipments: 24 },
        { name: 'Tue', revenue: 3000, shipments: 13 },
        { name: 'Wed', revenue: 2000, shipments: 98 },
        { name: 'Thu', revenue: 2780, shipments: 39 },
        { name: 'Fri', revenue: 1890, shipments: 48 },
        { name: 'Sat', revenue: 2390, shipments: 38 },
        { name: 'Sun', revenue: 3490, shipments: 43 },
    ];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Modified from absolute URL to relative to support deployment properly
                const res = await axios.get('/api/shipments');
                setShipments(res.data.data || []);
                setLoading(false);
            } catch (err) {
                console.error("Dashboard data fetch failed", err);
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (userRole === 'Admin' || userRole === 'Manager') {
        return <AdminDashboard shipments={shipments} loading={loading} analyticsData={analyticsData} />;
    } else if (userRole === 'Driver') {
        return <DriverDashboard shipments={shipments} loading={loading} />;
    } else {
        return <CustomerDashboard shipments={shipments} loading={loading} />;
    }
}

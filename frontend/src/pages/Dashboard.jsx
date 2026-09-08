import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Dashboard({ userRole }) {
    const [stats, setStats] = useState([
        { name: 'Total Shipments', value: '0', change: '0%', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
        { name: 'In Transit', value: '0', change: '0%', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
        { name: 'Delivered', value: '0', change: '0%', icon: 'M5 13l4 4L19 7' },
        { name: 'Pending', value: '0', change: '0%', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
    ]);
    const [recentShipments, setRecentShipments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock analytics data for the charts
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
                const res = await axios.get('http://localhost:5000/api/shipments');
                const shipments = res.data.data;

                const inTransit = shipments.filter(s => s.status === 'In Transit').length;
                const delivered = shipments.filter(s => s.status === 'Delivered').length;
                const pending = shipments.filter(s => s.status === 'Pending').length;

                setStats([
                    { name: 'Total Shipments', value: shipments.length.toString(), change: '+12%', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
                    { name: 'In Transit', value: inTransit.toString(), change: '+4.5%', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                    { name: 'Delivered', value: delivered.toString(), change: '+18.2%', icon: 'M5 13l4 4L19 7' },
                    { name: 'Pending', value: pending.toString(), change: '-2.1%', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
                ]);

                setRecentShipments(shipments.slice(0, 5));
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'In Transit': return 'bg-blue-100 text-blue-800';
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Out for Delivery': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="p-8 text-center text-indigo-500 font-medium tracking-wide">Loading Operational Analytics...</div>;

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">{userRole === 'Customer' ? 'Customer Dashboard' : 'Operational Overview'}</h2>
                <p className="mt-1 text-sm text-gray-500">{userRole === 'Customer' ? 'Track your active outbound requests easily.' : 'Your global logistics network analytics.'}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center hover:shadow-lg transition-all transform hover:-translate-y-1">
                        <div className="p-3 rounded-full bg-indigo-50 text-indigo-600 mr-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon}></path>
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                            <div className="flex items-baseline space-x-2">
                                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                                <span className={`text-xs font-semibold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Advanced Future Enhancement: Analytics Charts */}
            {userRole !== 'Driver' && userRole !== 'Customer' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Volume Over Time</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analyticsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorShipments" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                    <Area type="monotone" dataKey="shipments" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorShipments)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Revenue Projection</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analyticsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                    <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Shipments */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Shipments Activity</h3>
                    <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800 transition">View Full History &rarr;</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-gray-100 text-sm">
                                <th className="px-6 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Tracking ID</th>
                                <th className="px-6 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Client</th>
                                <th className="px-6 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Destination</th>
                                <th className="px-6 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentShipments.map((shipment) => (
                                <tr key={shipment.shipmentId} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{shipment.shipmentId}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{shipment.customer?.name || 'Unknown User'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 flex items-center">
                                        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        {shipment.destination}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(shipment.status).replace('text-', 'border-').replace('bg-', '')} ${getStatusColor(shipment.status)}`}>
                                            {shipment.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {recentShipments.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">No recent activity detected.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

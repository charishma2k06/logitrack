import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dashboard from './pages/Dashboard';
import Shipments from './pages/Shipments';
import Tracking from './pages/Tracking';
import Customers from './pages/Customers';
import Drivers from './pages/Drivers';
import Vehicles from './pages/Vehicles';
import Orders from './pages/Orders';
import Login from './pages/Login';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
    const [user, setUser] = useState(null);
    const [time, setTime] = useState(new Date());
    const location = useLocation();
    const navigate = useNavigate();

    // Feature: Live Clock
    useEffect(() => {
        if (!user) return;
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, [user]);

    const testAccounts = [
        { label: 'Admin', email: 'admin@logitrack.com' },
        { label: 'Manager', email: 'manager@logitrack.com' },
        { label: 'Driver', email: 'driver1@logitrack.com' },
        { label: 'Customer', email: 'customer1@logitrack.com' },
    ];

    const handleLoginSuccess = (token, loggedUser) => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(loggedUser);
        if (loggedUser.role === 'Driver') {
            navigate('/shipments');
        } else {
            navigate('/');
        }
    };

    const handleLogout = () => {
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        navigate('/');
    }

    const switchAccount = async (email) => {
        try {
            const res = await axios.post('/api/auth/login', {
                email: email,
                password: 'password123'
            });
            handleLoginSuccess(res.data.token, res.data.user);
        } catch (error) {
            console.error('Login failed');
        }
    };

    if (!user) {
        return <Login onLoginSuccess={handleLoginSuccess} />
    }

    const navLinkClass = (path) => `flex items-center justify-between px-4 py-3 rounded-lg transition ${location.pathname === path ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'}`;
    const isAdmin = user?.role === 'Admin' || user?.role === 'Manager';
    const isDriver = user?.role === 'Driver';
    const isCustomer = user?.role === 'Customer';

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <aside className="w-64 bg-indigo-950 text-white flex flex-col pt-6 fixed h-full z-10 font-medium shadow-xl">
                <div className="px-6 mb-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold tracking-wider text-white flex items-center">
                        <svg className="w-6 h-6 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        LogiTrack
                    </h1>
                </div>
                <nav className="flex-1 space-y-2 px-4 overflow-y-auto w-full custom-scrollbar">
                    {isAdmin && (
                        <>
                            <Link to="/" className={navLinkClass("/")}>
                                <div className="flex items-center"><svg className="w-5 h-5 opacity-75 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg><span>Dashboard</span></div>
                            </Link>
                            <Link to="/shipments" className={navLinkClass("/shipments")}>
                                <div className="flex items-center"><svg className="w-5 h-5 opacity-75 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path></svg><span>Shipments</span></div>
                                <span className="bg-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full">New</span>
                            </Link>
                            <Link to="/orders" className={navLinkClass("/orders")}>
                                <div className="flex items-center"><svg className="w-5 h-5 opacity-75 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg><span>Orders</span></div>
                                <span className="bg-amber-500 text-[10px] font-bold px-2 py-0.5 rounded-full text-amber-950">3 Alerts</span>
                            </Link>
                            <div className="pt-4 pb-2 text-xs text-indigo-400 uppercase tracking-widest pl-4">Network</div>
                            <Link to="/customers" className={navLinkClass("/customers")}>
                                <div className="flex items-center"><svg className="w-5 h-5 opacity-75 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5V4a2 2 0 00-2-2H4a2 2 0 00-2 2v16h5m8 0v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2m8 0h-6"></path></svg><span>Customers</span></div>
                            </Link>
                            <Link to="/drivers" className={navLinkClass("/drivers")}>
                                <div className="flex items-center"><svg className="w-5 h-5 opacity-75 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg><span>Drivers</span></div>
                            </Link>
                            <Link to="/vehicles" className={navLinkClass("/vehicles")}>
                                <div className="flex items-center"><svg className="w-5 h-5 opacity-75 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg><span>Vehicles</span></div>
                            </Link>
                        </>
                    )}

                    {isDriver && (
                        <Link to="/shipments" className={navLinkClass("/shipments")}>
                            <div className="flex items-center"><svg className="w-5 h-5 opacity-75 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path></svg><span>My Deliveries</span></div>
                        </Link>
                    )}

                    {isCustomer && (
                        <>
                            <Link to="/" className={navLinkClass("/")}>
                                <div className="flex items-center"><svg className="w-5 h-5 opacity-75 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg><span>Customer Home</span></div>
                            </Link>
                            <Link to="/shipments" className={navLinkClass("/shipments")}>
                                <div className="flex items-center"><svg className="w-5 h-5 opacity-75 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path></svg><span>My Shipments</span></div>
                            </Link>
                            <Link to="/orders" className={navLinkClass("/orders")}>
                                <div className="flex items-center"><svg className="w-5 h-5 opacity-75 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg><span>My Invoices</span></div>
                            </Link>
                        </>
                    )}

                    <div className="pt-4 pb-2 text-xs text-indigo-400 uppercase tracking-widest pl-4">Tools</div>
                    <Link to="/tracking" className={navLinkClass("/tracking")}>
                        <div className="flex items-center"><svg className="w-5 h-5 opacity-75 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path></svg><span>Tracking Portal</span></div>
                    </Link>
                </nav>

                <div className="px-6 py-6 border-t border-indigo-900 bg-indigo-950">
                    <label className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-2 block">Developer Switcher</label>
                    <select
                        className="w-full bg-indigo-900 text-indigo-100 text-xs font-bold rounded-lg px-3 py-2 border border-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 cursor-pointer"
                        value={user?.email}
                        onChange={(e) => switchAccount(e.target.value)}
                    >
                        {testAccounts.map(acc => (
                            <option key={acc.email} value={acc.email}>{acc.label} ({acc.email})</option>
                        ))}
                    </select>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">{user?.name ? user.name[0] : 'U'}</div>
                            <div>
                                <p className="text-sm font-bold leading-tight truncate w-24 text-white">{user?.name}</p>
                                <p className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse"></span>
                                    {user?.role}
                                </p>
                            </div>
                        </div>
                        <button onClick={handleLogout} title="Logout" className="text-indigo-400 hover:text-white transition p-1 bg-indigo-900 hover:bg-red-500 rounded-lg border border-indigo-800 hover:border-red-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        </button>
                    </div>
                </div>
            </aside>

            <main className="ml-64 flex-1 flex flex-col min-h-screen">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
                    <div className="flex items-center bg-gray-100/80 rounded-full px-4 py-1.5 w-96 border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all shadow-inner">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <input type="text" placeholder="Search orders, shipments, tracking..." className="bg-transparent border-none focus:outline-none ml-2 w-full text-sm text-gray-700 placeholder-gray-400 py-1 font-medium" />
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="hidden lg:flex flex-col text-right">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Local Dispatch Time</span>
                            <span className="text-sm font-bold text-indigo-950 font-mono tracking-tight">{time.toLocaleTimeString()}</span>
                        </div>

                        <button className="relative text-gray-400 hover:text-indigo-600 transition group p-1 z-20">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>

                            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all text-left overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                    <span className="font-bold text-gray-800 text-sm">Action Center</span>
                                    <span className="text-[10px] bg-red-100 text-red-700 px-2 rounded-full font-bold">2 New</span>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    <div className="px-4 py-3 border-b border-gray-50 hover:bg-indigo-50/50 cursor-pointer transition">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-bold text-gray-900">Shipment SHP-1001 Delivered</p>
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5">2 minutes ago in Los Angeles, CA</p>
                                    </div>
                                    <div className="px-4 py-3 border-b border-gray-50 hover:bg-indigo-50/50 cursor-pointer transition">
                                        <p className="text-sm font-bold text-gray-900">New Order ORD-5024 Created</p>
                                        <p className="text-xs text-gray-500 mt-0.5">15 minutes ago by TechCorp</p>
                                    </div>
                                </div>
                                <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-center text-xs text-indigo-600 font-bold hover:text-indigo-800 cursor-pointer uppercase tracking-wider">Mark all as read</div>
                            </div>
                        </button>

                        <div className="flex flex-col text-right pl-4 border-l border-gray-200">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Active Session</span>
                            <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 rounded-md">{user?.role} Portal</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-8 overflow-y-auto w-full max-w-7xl mx-auto custom-scrollbar bg-gray-50/50">
                    <Routes>
                        <Route path="/" element={<Dashboard userRole={user?.role} />} />
                        <Route path="/shipments" element={<Shipments userRole={user?.role} userId={user?._id} />} />
                        <Route path="/customers" element={<Customers />} />
                        <Route path="/drivers" element={<Drivers />} />
                        <Route path="/vehicles" element={<Vehicles />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/tracking" element={<Tracking />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}

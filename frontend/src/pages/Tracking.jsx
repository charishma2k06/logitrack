import React, { useState } from 'react';
import axios from 'axios';

export default function Tracking() {
    const [trackingId, setTrackingId] = useState('');
    const [shipmentData, setShipmentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!trackingId.trim()) return;

        setLoading(true);
        setError('');

        try {
            const res = await axios.get(`/api/tracking/${trackingId}`);
            if (res.data.success) {
                setShipmentData(res.data.data);
            } else {
                setError('Shipment not found. Please verify the tracking ID.');
            }
        } catch (err) {
            if (err.response?.status === 404) {
                setError('Shipment not found. Please verify the tracking ID.');
            } else {
                setError('An error occurred connecting to the tracking system.');
            }
            setShipmentData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Track Your Shipment</h2>
                <p className="text-gray-500 max-w-xl mx-auto">Enter your LogiTrack ID below to get real-time status updates on your delivery instantly.</p>

                <form onSubmit={handleSearch} className="flex max-w-md mx-auto mt-6 shadow-sm rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                    <input
                        type="text"
                        placeholder="e.g., SHP-4912"
                        className="flex-1 px-5 py-4 border-none focus:outline-none text-gray-800 font-medium tracking-wide uppercase"
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                    />
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 font-semibold transition" disabled={loading}>
                        {loading ? 'Searching...' : 'Track'}
                    </button>
                </form>
                {error && <p className="text-red-500 mt-2 text-sm font-medium animate-pulse">{error}</p>}
            </div>

            {shipmentData && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up">
                    {/* Header Info */}
                    <div className="bg-indigo-900 p-8 text-white flex justify-between items-center relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-indigo-200 text-sm font-semibold uppercase tracking-widest mb-1">Tracking Summary</p>
                            <h3 className="text-3xl font-bold">{shipmentData.shipmentId}</h3>
                        </div>
                        <div className="text-right relative z-10">
                            <p className="text-indigo-200 text-sm font-semibold uppercase tracking-widest mb-1">Current Status</p>
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider
                ${shipmentData.status === 'Delivered' ? 'bg-green-400 text-green-900' :
                                    shipmentData.status === 'In Transit' ? 'bg-blue-400 text-blue-900' : 'bg-yellow-400 text-yellow-900'}`}>
                                {shipmentData.status}
                            </span>
                        </div>
                        {/* Background pattern */}
                        <svg className="absolute right-0 bottom-0 opacity-10 w-64 h-64 transform translate-x-16 translate-y-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                    </div>

                    <div className="p-8 pb-4 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-100">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Origin</p>
                            <p className="text-lg font-medium text-gray-900">{shipmentData.origin}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Destination</p>
                            <p className="text-lg font-medium text-gray-900">{shipmentData.destination}</p>
                        </div>
                    </div>

                    <div className="p-8 bg-gray-50">
                        {/* Live Map Representation */}
                        <div className="mb-8 rounded-xl overflow-hidden shadow-sm border border-gray-200 h-64 relative bg-gray-200">
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                                marginHeight="0"
                                marginWidth="0"
                                src={`https://www.openstreetmap.org/export/embed.html?bbox=-122.5%2C37.6%2C-122.0%2C37.9&layer=mapnik&marker=37.75%2C-122.25`}
                                style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1)' }}
                                title="live tracker map"
                            ></iframe>
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow font-medium text-sm text-gray-800 flex items-center border border-gray-100">
                                <span className="relative flex h-3 w-3 mr-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                                </span>
                                Live LogiTrack Satellite Feed
                            </div>
                        </div>

                        {/* Timeline */}
                        <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Shipment Journey
                        </h4>

                        <div className="relative border-l-2 border-indigo-200 ml-3 space-y-8">
                            <div className="relative pl-8">
                                <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-indigo-600 border-4 border-white shadow-sm"></span>
                                <p className="text-xs font-bold text-indigo-600 uppercase mb-1">{new Date(shipmentData.updatedAt || shipmentData.createdAt).toLocaleString()}</p>
                                <p className="font-semibold text-gray-900">{shipmentData.status === 'Pending' ? 'Shipment Created' : 'Status Updated'}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {shipmentData.status === 'Pending' ? 'Your shipment request has been received.'
                                        : shipmentData.status === 'In Transit' ? 'Package is traveling to the destination facility.'
                                            : shipmentData.status === 'Out for Delivery' ? 'Driver is currently dispatched for final drop-off.'
                                                : shipmentData.status === 'Delivered' ? 'The package logic has been successfully completed.' : 'Status changed.'}
                                </p>
                            </div>

                            {/* Fake initial journey point to make timeline look good */}
                            {shipmentData.status !== 'Pending' && (
                                <div className="relative pl-8 opacity-60">
                                    <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-gray-300 border-4 border-white shadow-sm"></span>
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">{new Date(shipmentData.createdAt).toLocaleDateString()}</p>
                                    <p className="font-semibold text-gray-700">Dispatched from {shipmentData.origin}</p>
                                    <p className="text-sm text-gray-500 mt-1">Package successfully scanned into origin LogiTrack hub.</p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

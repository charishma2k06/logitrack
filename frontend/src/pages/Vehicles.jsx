import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Vehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        registrationNumber: '',
        vehicleType: 'Van',
        capacity: 2000,
        driver: '',
        status: 'Available'
    });

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/vehicles');
            setVehicles(res.data.data);

            const drivRes = await axios.get('/api/users?role=Driver');
            setDrivers(drivRes.data.data);
            if (drivRes.data.data.length > 0) {
                setFormData(prev => ({ ...prev, driver: drivRes.data.data[0]._id }));
            }
        } catch (error) {
            console.error('Failed to load vehicles');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/vehicles', {
                ...formData,
                vehicleId: `V-${Math.floor(Math.random() * 1000)}`
            });
            setIsModalOpen(false);
            fetchVehicles();
            setFormData(prev => ({ ...prev, registrationNumber: '', vehicleType: 'Van', capacity: 2000, status: 'Available' }));
        } catch (err) {
            alert('Error creating vehicle. Registration might be in use.');
        }
    };

    const filteredVehicles = vehicles.filter(v =>
        v.vehicleId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Vehicle Management</h2>
                    <p className="mt-1 text-sm text-gray-500">Track and manage your logistics transport fleet.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition shadow-sm flex items-center"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path></svg>
                    Add Vehicle
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <div className="relative w-72">
                        <input
                            type="text"
                            placeholder="Search ID or Registration..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading Fleet...</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white border-b border-gray-100 text-sm">
                                    <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider">Vehicle ID</th>
                                    <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider">Registration</th>
                                    <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider">Type & Capacity</th>
                                    <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider">Assigned Driver</th>
                                    <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredVehicles.map((vehicle) => (
                                    <tr key={vehicle._id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{vehicle.vehicleId}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{vehicle.registrationNumber}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="font-medium">{vehicle.vehicleType}</div>
                                            <div className="text-xs text-gray-500">{vehicle.capacity} kg</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{vehicle.driver?.name || 'Unassigned'}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium 
                        ${vehicle.status === 'Available' ? 'bg-green-100 text-green-800' :
                                                    vehicle.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                                                        vehicle.status === 'Maintenance' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'}`}>
                                                {vehicle.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Make Vehicle Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-fade-in-up">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold">Register Vehicle</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
                        </div>
                        <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Plate</label>
                                <input required type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.registrationNumber} onChange={e => setFormData({ ...formData, registrationNumber: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        value={formData.vehicleType} onChange={e => setFormData({ ...formData, vehicleType: e.target.value })}
                                    >
                                        <option>Van</option>
                                        <option>Pickup</option>
                                        <option>Heavy Truck</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (kg)</label>
                                    <input required type="number" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Driver (Optional)</label>
                                <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.driver} onChange={e => setFormData({ ...formData, driver: e.target.value })}
                                >
                                    <option value="">-- None --</option>
                                    {drivers.map(d => (
                                        <option key={d._id} value={d._id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="pt-4 flex justify-end space-x-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 rounded text-sm text-white hover:bg-indigo-700 shadow-sm">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

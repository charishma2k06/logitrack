import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Shipments({ userRole, userId }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [shipments, setShipments] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    // Create Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        shipmentType: 'Standard',
        weight: 0,
        quantity: 1,
        packageDescription: ''
    });

    // Assign Modal state
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [activeShipmentId, setActiveShipmentId] = useState('');
    const [assignData, setAssignData] = useState({
        driver: '',
        vehicle: ''
    });

    const fetchShipmentsAndFleet = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/shipments');
            let results = res.data.data;

            if (userRole === 'Customer' && userId) {
                results = results.filter(r => r.customer?._id === userId);
            } else if (userRole === 'Driver' && userId) {
                results = results.filter(r => r.driver === userId || r.driver?._id === userId);
            }

            setShipments(results);

            // Only admins need fleet data
            if (userRole === 'Admin' || userRole === 'Manager') {
                const [drivRes, vehRes] = await Promise.all([
                    axios.get('/api/users?role=Driver'),
                    axios.get('/api/vehicles')
                ]);
                setDrivers(drivRes.data.data);
                setVehicles(vehRes.data.data);
            }
        } catch (err) {
            console.error('Failed to load data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShipmentsAndFleet();
    }, [userRole, userId]);

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/shipments', formData);
            setIsModalOpen(false);
            fetchShipmentsAndFleet();
            setFormData({ origin: '', destination: '', shipmentType: 'Standard', weight: 0, quantity: 1, packageDescription: '' });
        } catch (err) {
            alert('Error creating shipment');
        }
    };

    const handleAssignSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/shipments/${activeShipmentId}`, {
                driver: assignData.driver || null,
                vehicle: assignData.vehicle || null,
                status: 'Confirmed'
            });
            setIsAssignModalOpen(false);
            fetchShipmentsAndFleet();
        } catch (err) {
            alert('Error assigning fleet. Vehicle/Driver might be invalid.');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this shipment?')) {
            try {
                await axios.delete(`/api/shipments/${id}`);
                fetchShipmentsAndFleet();
            } catch (err) {
                alert('Error deleting shipment (requires elevated permissions)');
            }
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.put(`/api/shipments/${id}`, { status: newStatus });
            fetchShipmentsAndFleet();
        } catch (err) {
            alert('Failed to update shipment status.');
        }
    };

    const exportToCSV = () => {
        if (shipments.length === 0) return;
        const headers = ['Shipment ID', 'Customer', 'Origin', 'Destination', 'Type', 'Weight (kg)', 'Status', 'Driver'];
        const rows = shipments.map(s => [
            s.shipmentId,
            s.customer?.name || 'Unknown',
            s.origin,
            s.destination,
            s.shipmentType,
            s.weight,
            s.status,
            s.driver?.name || 'Unassigned'
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `logitrack_shipments_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'In Transit': return 'bg-blue-100 text-blue-800 border border-blue-200';
            case 'Delivered': return 'bg-green-100 text-green-800 border border-green-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            case 'Out for Delivery': return 'bg-purple-100 text-purple-800 border border-purple-200';
            case 'Confirmed': return 'bg-teal-100 text-teal-800 border border-teal-200';
            default: return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };

    const filteredShipments = shipments.filter(s =>
        s.shipmentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.destination?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{userRole === 'Customer' ? 'My Shipments' : userRole === 'Driver' ? 'My Deliveries' : 'Corporate Shipments'}</h2>
                    <p className="mt-1 text-sm text-gray-500">{userRole === 'Customer' ? 'Logistics transparency and outbound tracking.' : userRole === 'Driver' ? 'Manage, track, and update your assigned dispatch routes.' : 'Global operational monitoring and dispatch mechanics.'}</p>
                </div>
                <div className="flex space-x-3">
                    {(userRole === 'Admin' || userRole === 'Manager') && (
                        <button onClick={exportToCSV} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm transition shadow-sm flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            Export CSV
                        </button>
                    )}
                    {userRole !== 'Driver' && (
                        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition shadow-sm flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            {userRole === 'Customer' ? 'Request Pickup' : 'Generate Shipment'}
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <div className="relative w-80">
                        <input
                            type="text" placeholder="Scan or search tracking ID..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm shadow-inner"
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 flex flex-col items-center text-indigo-500 font-medium">
                            <svg className="animate-spin h-8 w-8 mb-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Syncing Fleet...
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-sm">
                                    <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Tracking ID</th>
                                    <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Account</th>
                                    <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Trajectory</th>
                                    <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Dispatch Unit</th>
                                    <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Realtime Status</th>
                                    {(userRole !== 'Customer') && (
                                        <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-right text-xs">Network Control</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 bg-white">
                                {filteredShipments.map((shipment) => (
                                    <tr key={shipment.shipmentId} className="hover:bg-indigo-50/20 transition-colors group">
                                        <td className="px-6 py-5 text-sm font-bold text-gray-900 flex flex-col">
                                            <span className="text-indigo-600">{shipment.shipmentId}</span>
                                            <span className="text-[11px] text-gray-400 mt-0.5 tracking-wider font-semibold">{new Date(shipment.createdAt).toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-gray-600">
                                            <div className="font-semibold text-gray-800">{shipment.customer?.name || 'Local'}</div>
                                            <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">{shipment.shipmentType} • {shipment.weight} KG</div>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-gray-600">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center text-xs font-medium text-gray-700">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500/20 border border-blue-500 mr-2"></span>
                                                    {shipment.origin}
                                                </div>
                                                <div className="flex items-center text-xs font-medium text-gray-700">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500 mr-2"></span>
                                                    {shipment.destination}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-gray-600">
                                            <div className="font-semibold text-gray-800 flex items-center">
                                                {shipment.driver?.name ? (
                                                    <><div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div> {shipment.driver.name}</>
                                                ) : 'Unassigned'}
                                            </div>
                                            <div className="text-[11px] text-gray-500 font-medium tracking-wider uppercase mt-0.5">{shipment.vehicle?.registrationNumber || 'No Asset'}</div>
                                        </td>
                                        <td className="px-6 py-5 text-sm">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${getStatusColor(shipment.status)} shadow-sm`}>
                                                {shipment.status}
                                            </span>
                                        </td>
                                        {(userRole !== 'Customer') && (
                                            <td className="px-6 py-5 text-sm text-right h-full">
                                                <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">

                                                    {/* Advanced Role Rendering for actions */}
                                                    {(userRole === 'Admin' || userRole === 'Manager') && shipment.status !== 'Delivered' && (
                                                        <button onClick={() => {
                                                            setActiveShipmentId(shipment.shipmentId);
                                                            setAssignData({ driver: shipment.driver?._id || '', vehicle: shipment.vehicle?._id || '' });
                                                            setIsAssignModalOpen(true);
                                                        }} className="text-[11px] bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-sm">
                                                            Dispatch
                                                        </button>
                                                    )}

                                                    <select
                                                        className="bg-indigo-50 border-none text-indigo-700 text-xs rounded-lg px-3 py-1.5 focus:ring-0 cursor-pointer font-bold outline-none uppercase tracking-wider ml-2"
                                                        value={shipment.status}
                                                        onChange={(e) => handleStatusUpdate(shipment.shipmentId, e.target.value)}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Confirmed">Confirmed</option>
                                                        <option value="In Transit">In Transit</option>
                                                        <option value="Out for Delivery">Final Drop</option>
                                                        <option value="Delivered">Delivered</option>
                                                    </select>

                                                    {(userRole === 'Admin' || userRole === 'Manager') && (
                                                        <button
                                                            onClick={() => handleDelete(shipment.shipmentId)}
                                                            className="text-red-600 hover:text-white hover:bg-red-600 font-bold ml-2 bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg transition"
                                                        >
                                                            X
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {!loading && filteredShipments.length === 0 && (
                        <div className="p-12 text-center text-gray-500 font-medium">
                            No matching records discovered in the data store.
                        </div>
                    )}
                </div>
            </div>

            {/* Origin Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                    ...
                </div>
            )}

            {/* Origin Create Modal (Correct Form) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-up">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
                            <h3 className="text-lg font-bold text-gray-900">Issue Waybill</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 text-xl font-bold">&times;</button>
                        </div>
                        <form onSubmit={handleCreateSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5">Origin Node</label>
                                <input required type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                    value={formData.origin} onChange={e => setFormData({ ...formData, origin: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5">Drop Node</label>
                                <input required type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                    value={formData.destination} onChange={e => setFormData({ ...formData, destination: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5">Mass (kg)</label>
                                    <input required type="number" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition bg-gray-50 font-bold text-indigo-700"
                                        value={formData.weight} onChange={e => setFormData({ ...formData, weight: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5">Class</label>
                                    <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition font-medium"
                                        value={formData.shipmentType} onChange={e => setFormData({ ...formData, shipmentType: e.target.value })}
                                    >
                                        <option>Standard</option>
                                        <option>Express</option>
                                        <option>Freight</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-2 flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition">Discard</button>
                                <button type="submit" className="px-5 py-2.5 bg-indigo-600 rounded-lg text-sm font-bold text-white hover:bg-indigo-700 shadow-md transition">Lock Shipment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Admin Dispatch Assignment Modal */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-up">
                        <div className="px-6 py-5 flex justify-between items-center bg-indigo-900 text-white">
                            <h3 className="text-lg font-bold">Dispatch Control</h3>
                            <button onClick={() => setIsAssignModalOpen(false)} className="text-indigo-200 hover:text-white text-xl font-bold">&times;</button>
                        </div>
                        <form onSubmit={handleAssignSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5">Allocated Driver</label>
                                <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition font-medium bg-gray-50"
                                    value={assignData.driver} onChange={e => setAssignData({ ...assignData, driver: e.target.value })}
                                >
                                    <option value="">-- Queue Later --</option>
                                    {drivers.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5">Assigned Asset (Vehicle)</label>
                                <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition font-medium bg-gray-50"
                                    value={assignData.vehicle} onChange={e => setAssignData({ ...assignData, vehicle: e.target.value })}
                                >
                                    <option value="">-- Unassigned --</option>
                                    {vehicles.map(v => <option key={v._id} value={v._id}>{v.registrationNumber} ({v.vehicleType})</option>)}
                                </select>
                            </div>
                            <div className="pt-2 flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsAssignModalOpen(false)} className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 bg-indigo-600 rounded-lg text-sm font-bold text-white hover:bg-indigo-700 shadow-md transition">Commit Dispatch</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}

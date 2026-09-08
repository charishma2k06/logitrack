import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        customer: '',
        amount: 100,
        paymentStatus: 'Pending',
        orderStatus: 'Processing'
    });

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/orders');
            setOrders(res.data.data);

            const custRes = await axios.get('/api/users?role=Customer');
            setCustomers(custRes.data.data);
            if (custRes.data.data.length > 0) {
                setFormData(prev => ({ ...prev, customer: custRes.data.data[0]._id }));
            }
        } catch (error) {
            console.error('Failed to load orders or customers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/orders', {
                ...formData,
                orderId: `ORD-${Math.floor(Math.random() * 10000)}`
            });
            setIsModalOpen(false);
            fetchOrders();
            setFormData(prev => ({ ...prev, amount: 100, paymentStatus: 'Pending', orderStatus: 'Processing' }));
        } catch (err) {
            alert('Error creating order.');
        }
    };

    const handlePrintParams = (order) => {
        // Mocking a professional invoice generation that opens print dialog
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(`
        <html>
            <head>
               <title>Invoice ${order.orderId}</title>
               <style>
                  body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
                  .header { border-bottom: 2px solid #4f46e5; padding-bottom: 20px; margin-bottom: 40px; display: flex; justify-content: space-between;}
                  .logo { font-size: 24px; font-weight: bold; color: #4f46e5; }
                  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                  th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ccc; }
                  .total { font-size: 20px; font-weight: bold; text-align: right; margin-top: 30px; }
               </style>
            </head>
            <body>
               <div class="header">
                  <div class="logo">LogiTrack Enterprises</div>
                  <div>
                     <b>INVOICE</b><br/>
                     Date: ${new Date().toLocaleDateString()}<br/>
                     Invoice #: ${order.orderId}
                  </div>
               </div>
               <div>
                  <b>Bill To:</b><br/>
                  ${order.customer?.name || 'Valued Customer'}<br/>
                  ${order.customer?.email || 'N/A'}<br/>
               </div>
               <table>
                  <tr><th>Description</th><th>Amount</th><th>Status</th></tr>
                  <tr>
                     <td>Logistics Freighting Charges<br/><small>Ref: ${order.shipment?.shipmentId || 'Manual Order'}</small></td>
                     <td>$${order.amount.toFixed(2)}</td>
                     <td>${order.paymentStatus}</td>
                  </tr>
               </table>
               <div class="total">Total Due: $${order.amount.toFixed(2)}</div>
               <p style="margin-top: 50px; font-size: 12px; color: #888; text-align: center;">Thank you for doing business with LogiTrack.</p>
               <script>window.print(); window.close();</script>
            </body>
        </html>
      `);
        printWindow.document.close();
    };

    const filteredOrders = orders.filter(o =>
        o.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Order & Billing Management</h2>
                    <p className="mt-1 text-sm text-gray-500">Track financial billing for outbound packages and issue statements.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition shadow-sm flex items-center"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    Create Order
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <div className="relative w-72">
                        <input
                            type="text"
                            placeholder="Search Order ID or Customer..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading Orders...</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white border-b border-gray-100 text-sm">
                                    <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider">Billed To</th>
                                    <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider">Payment Status</th>
                                    <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider">Order Status</th>
                                    <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-medium text-indigo-600">{order.orderId}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="font-medium text-gray-900">{order.customer?.name || 'Manual Entry'}</div>
                                            <div className="text-xs text-gray-500">Shipment ID: {order.shipment?.shipmentId || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-bold">${order.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border
                        ${order.paymentStatus === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    order.paymentStatus === 'Failed' ? 'bg-red-50 text-red-700 border-red-200' :
                                                        'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border
                        ${order.orderStatus === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    order.orderStatus === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                                        'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right">
                                            <button
                                                onClick={() => handlePrintParams(order)}
                                                className="text-gray-500 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end w-full"
                                            >
                                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                                                Print
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Make Order Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-fade-in-up">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold">Generate Invoice</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
                        </div>
                        <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Customer</label>
                                <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.customer} onChange={e => setFormData({ ...formData, customer: e.target.value })}
                                >
                                    {customers.map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Billing Amount ($)</label>
                                <input required type="number" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.amount} onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                                <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.paymentStatus} onChange={e => setFormData({ ...formData, paymentStatus: e.target.value })}
                                >
                                    <option>Pending</option>
                                    <option>Completed</option>
                                    <option>Failed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
                                <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.orderStatus} onChange={e => setFormData({ ...formData, orderStatus: e.target.value })}
                                >
                                    <option>Processing</option>
                                    <option>Completed</option>
                                    <option>Cancelled</option>
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

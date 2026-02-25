import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Eye, Filter } from 'lucide-react';
import Navbar from '../components/Navbar';
import API from '../services/api';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await API.get('/orders/admin/all');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      
      alert('✓ Status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-500',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-500',
      processing: 'bg-purple-100 text-purple-800 border-purple-500',
      shipped: 'bg-indigo-100 text-indigo-800 border-indigo-500',
      delivered: 'bg-green-100 text-green-800 border-green-500',
      cancelled: 'bg-red-100 text-red-800 border-red-500'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-500';
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-display font-black text-dark-900 mb-2">
            MANAGE ORDERS
          </h1>
          <p className="text-dark-600 font-semibold">
            {orders.length} total orders
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white border-4 border-black p-4">
          <div className="flex items-center gap-3 mb-4">
            <Filter size={20} className="text-dark-900" strokeWidth={2.5} />
            <h2 className="font-black text-dark-900 uppercase">Filter by Status</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 font-bold uppercase text-sm border-2 transition-all ${
                  filter === status
                    ? 'bg-primary-500 text-white border-black'
                    : 'bg-white text-dark-900 border-dark-900 hover:bg-dark-50'
                }`}
              >
                {status === 'all' ? `All (${orders.length})` : `${status} (${orders.filter(o => o.status === status).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white border-4 border-black p-12 text-center">
            <Package size={80} className="mx-auto text-dark-300 mb-4" strokeWidth={2} />
            <h2 className="text-4xl font-display font-black text-dark-900 mb-4">
              NO ORDERS FOUND
            </h2>
            <p className="text-xl text-dark-600 font-semibold">
              {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
            </p>
          </div>
        ) : (
          <div className="bg-white border-4 border-black overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-900 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-black uppercase text-sm">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left font-black uppercase text-sm">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left font-black uppercase text-sm">
                      Items
                    </th>
                    <th className="px-4 py-3 text-left font-black uppercase text-sm">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left font-black uppercase text-sm">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-black uppercase text-sm">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left font-black uppercase text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-dark-200">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-primary-50 transition-colors">
                      <td className="px-4 py-4 font-black text-dark-900">
                        #{order._id.slice(-8)}
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-bold text-dark-900">{order.user?.name || 'N/A'}</p>
                          <p className="text-xs font-semibold text-dark-600">{order.user?.email || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-semibold text-dark-700">
                        {order.items.length} item(s)
                      </td>
                      <td className="px-4 py-4 font-black text-dark-900">
                        ₹{order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          disabled={order.status === 'delivered' || order.status === 'cancelled'}
                          className={`px-3 py-2 font-black text-xs uppercase border-2 focus:outline-none ${getStatusColor(order.status)} ${
                            order.status === 'delivered' || order.status === 'cancelled'
                              ? 'cursor-not-allowed opacity-75'
                              : 'cursor-pointer'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 font-semibold text-dark-700">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        <Link to={`/orders/${order._id}`}>
                          <button className="bg-primary-500 text-white px-3 py-2 font-bold uppercase text-xs border-2 border-black hover:shadow-brutal-sm transition-all flex items-center gap-2">
                            <Eye size={14} strokeWidth={2.5} />
                            View
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
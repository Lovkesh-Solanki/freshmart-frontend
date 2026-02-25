import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Eye } from 'lucide-react';
import Navbar from '../components/Navbar';
import API from '../services/api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await API.get('/orders');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
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

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-primary-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white border-4 border-black p-12 text-center">
            <Package size={80} className="mx-auto text-dark-300 mb-4" strokeWidth={2} />
            <h2 className="text-4xl font-display font-black text-dark-900 mb-4">
              NO ORDERS YET
            </h2>
            <p className="text-xl text-dark-600 font-semibold mb-8">
              You haven't placed any orders yet
            </p>
            <Link to="/products">
              <button className="bg-primary-500 text-white px-8 py-4 font-black uppercase tracking-wider border-4 border-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                Start Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-5xl font-display font-black text-dark-900 mb-4">
            YOUR ORDERS
          </h1>
          <p className="text-dark-600 font-semibold">
            Track and manage your orders
          </p>
        </div>

        {/* Filter */}
        <div className="mb-6 flex flex-wrap gap-3">
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
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white border-4 border-black p-6 hover:shadow-brutal transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-dark-500 font-bold uppercase mb-1">
                    Order #{order._id.slice(-8)}
                  </p>
                  <p className="text-lg font-black text-dark-900">
                    ₹{order.totalAmount.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-4 py-2 font-black text-sm uppercase border-2 ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <Link to={`/orders/${order._id}`}>
                    <button className="bg-primary-500 text-white px-4 py-2 font-bold uppercase text-sm border-2 border-black hover:shadow-brutal-sm transition-all flex items-center gap-2">
                      <Eye size={16} strokeWidth={2.5} />
                      View
                    </button>
                  </Link>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-dark-500 font-bold uppercase mb-1">Ordered On</p>
                  <p className="text-dark-900 font-semibold">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-dark-500 font-bold uppercase mb-1">Items</p>
                  <p className="text-dark-900 font-semibold">
                    {order.items.length} item(s)
                  </p>
                </div>
                <div>
                  <p className="text-dark-500 font-bold uppercase mb-1">Payment</p>
                  <p className="text-dark-900 font-semibold">
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}
                  </p>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="mt-4 pt-4 border-t-2 border-dark-200">
                <div className="flex gap-2 overflow-x-auto">
                  {order.items.slice(0, 5).map((item) => (
                    <img
                      key={item._id}
                      src={item.product?.image}
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover border-2 border-black flex-shrink-0"
                    />
                  ))}
                  {order.items.length > 5 && (
                    <div className="w-16 h-16 bg-dark-100 border-2 border-black flex items-center justify-center font-black text-dark-900">
                      +{order.items.length - 5}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="bg-white border-4 border-black p-8 text-center">
            <p className="text-dark-600 font-bold text-lg">
              No {filter} orders found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Package, ShoppingCart, Users, DollarSign, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import API from '../services/api';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch basic stats
      const [ordersRes, productsRes] = await Promise.all([
        API.get('/orders/admin/all'),
        API.get('/products')
      ]);

      const orders = ordersRes.data;
      const products = productsRes.data;

      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => {
        if (order.status !== 'cancelled') {
          return sum + order.totalAmount;
        }
        return sum;
      }, 0);

      setStats({
        totalOrders: orders.length,
        totalRevenue: totalRevenue,
        totalProducts: products.length,
        totalUsers: 0 // You can add user count API
      });

      // Get recent orders
      setRecentOrders(orders.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
            ADMIN DASHBOARD
          </h1>
          <p className="text-dark-600 font-semibold">
            Overview of your store
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white border-4 border-black p-6 hover:shadow-brutal transition-all">
            <div className="w-12 h-12 bg-blue-500 border-2 border-black flex items-center justify-center mb-4">
              <ShoppingCart className="text-white" size={24} strokeWidth={2.5} />
            </div>
            <p className="text-sm font-bold text-dark-600 uppercase mb-1">Total Orders</p>
            <p className="text-4xl font-black text-dark-900">{stats.totalOrders}</p>
            <div className="mt-2 flex items-center gap-2">
              <TrendingUp size={16} className="text-green-600" strokeWidth={2.5} />
              <span className="text-xs font-bold text-green-600">Active</span>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white border-4 border-black p-6 hover:shadow-brutal transition-all">
            <div className="w-12 h-12 bg-green-500 border-2 border-black flex items-center justify-center mb-4">
              <DollarSign className="text-white" size={24} strokeWidth={2.5} />
            </div>
            <p className="text-sm font-bold text-dark-600 uppercase mb-1">Total Revenue</p>
            <p className="text-4xl font-black text-dark-900">₹{stats.totalRevenue.toFixed(0)}</p>
            <div className="mt-2 flex items-center gap-2">
              <TrendingUp size={16} className="text-green-600" strokeWidth={2.5} />
              <span className="text-xs font-bold text-green-600">+12%</span>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white border-4 border-black p-6 hover:shadow-brutal transition-all">
            <div className="w-12 h-12 bg-purple-500 border-2 border-black flex items-center justify-center mb-4">
              <Package className="text-white" size={24} strokeWidth={2.5} />
            </div>
            <p className="text-sm font-bold text-dark-600 uppercase mb-1">Total Products</p>
            <p className="text-4xl font-black text-dark-900">{stats.totalProducts}</p>
            <Link to="/admin/products" className="mt-2 text-xs font-bold text-primary-600 hover:text-primary-700">
              Manage →
            </Link>
          </div>

          {/* Users */}
          <div className="bg-white border-4 border-black p-6 hover:shadow-brutal transition-all">
            <div className="w-12 h-12 bg-orange-500 border-2 border-black flex items-center justify-center mb-4">
              <Users className="text-white" size={24} strokeWidth={2.5} />
            </div>
            <p className="text-sm font-bold text-dark-600 uppercase mb-1">Total Users</p>
            <p className="text-4xl font-black text-dark-900">-</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs font-bold text-dark-500">Coming Soon</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Link to="/admin/products">
            <button className="w-full bg-primary-500 text-white py-3 font-bold uppercase text-sm border-2 border-black shadow-brutal-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              Manage Products
            </button>
          </Link>
          <Link to="/admin/categories">
            <button className="w-full bg-white text-dark-900 py-3 font-bold uppercase text-sm border-2 border-black hover:bg-dark-50 transition-all">
              Manage Categories
            </button>
          </Link>
          <Link to="/admin/orders">
            <button className="w-full bg-white text-dark-900 py-3 font-bold uppercase text-sm border-2 border-black hover:bg-dark-50 transition-all">
              View Orders
            </button>
          </Link>
          <Link to="/products">
            <button className="w-full bg-white text-dark-900 py-3 font-bold uppercase text-sm border-2 border-black hover:bg-dark-50 transition-all">
              View Store
            </button>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white border-4 border-black">
          <div className="p-6 border-b-4 border-black bg-dark-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500 border-2 border-white flex items-center justify-center">
                <BarChart3 className="text-white" size={20} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-display font-black text-white uppercase">
                Recent Orders
              </h2>
            </div>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-dark-600 font-bold">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-black uppercase text-sm text-dark-900">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left font-black uppercase text-sm text-dark-900">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left font-black uppercase text-sm text-dark-900">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left font-black uppercase text-sm text-dark-900">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-black uppercase text-sm text-dark-900">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-dark-200">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-primary-50 transition-colors">
                      <td className="px-4 py-4 font-black text-dark-900">
                        #{order._id.slice(-8)}
                      </td>
                      <td className="px-4 py-4 font-semibold text-dark-700">
                        {order.user?.name || 'N/A'}
                      </td>
                      <td className="px-4 py-4 font-black text-dark-900">
                        ₹{order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 font-black text-xs uppercase border-2 ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-semibold text-dark-700">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-4 border-t-4 border-black bg-dark-50">
            <Link to="/admin/orders" className="font-bold text-primary-600 hover:text-primary-700 uppercase text-sm">
              View All Orders →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
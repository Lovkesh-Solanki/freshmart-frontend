import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, Phone, CreditCard, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import API from '../services/api';

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await API.get(`/orders/${id}`);
      setOrder(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order:', error);
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

  const getStatusSteps = () => {
    const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = steps.indexOf(order.status);
    return steps.map((step, index) => ({
      name: step,
      completed: index <= currentIndex
    }));
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

  if (!order) {
    return (
      <div className="min-h-screen bg-primary-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white border-4 border-black p-12 text-center">
            <h2 className="text-4xl font-display font-black text-dark-900 mb-4">
              ORDER NOT FOUND
            </h2>
            <button
              onClick={() => navigate('/orders')}
              className="bg-primary-500 text-white px-8 py-4 font-black uppercase border-4 border-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              Back to Orders
            </button>
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
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 text-dark-600 hover:text-dark-900 font-bold mb-6 transition-colors"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
          Back to Orders
        </button>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-display font-black text-dark-900 mb-2">
                ORDER #{order._id.slice(-8)}
              </h1>
              <p className="text-dark-600 font-semibold">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-6 py-3 font-black text-lg uppercase border-2 ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Tracking */}
            {order.status !== 'cancelled' && (
              <div className="bg-white border-4 border-black p-6">
                <h2 className="text-2xl font-display font-black text-dark-900 mb-6 uppercase">
                  Order Tracking
                </h2>
                <div className="space-y-4">
                  {getStatusSteps().map((step, index) => (
                    <div key={step.name} className="flex items-center gap-4">
                      <div className={`w-12 h-12 border-2 border-black flex items-center justify-center ${
                        step.completed ? 'bg-primary-500' : 'bg-white'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="text-white" size={24} strokeWidth={2.5} />
                        ) : (
                          <span className="font-black text-dark-400">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-black uppercase ${step.completed ? 'text-dark-900' : 'text-dark-400'}`}>
                          {step.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white border-4 border-black p-6">
              <h2 className="text-2xl font-display font-black text-dark-900 mb-6 uppercase">
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item._id} className="flex gap-4 pb-4 border-b-2 border-dark-200 last:border-0">
                    <img
                      src={item.product?.image}
                      alt={item.product?.name}
                      className="w-20 h-20 object-cover border-2 border-black"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-dark-900 mb-1">
                        {item.product?.name || 'Product'}
                      </h3>
                      <p className="text-sm text-dark-600 font-semibold mb-2">
                        {item.product?.unit}
                      </p>
                      <p className="text-sm font-semibold text-dark-700">
                        ₹{item.price} x {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-dark-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white border-4 border-black p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-500 border-2 border-black flex items-center justify-center">
                  <MapPin className="text-white" size={20} strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-display font-black text-dark-900 uppercase">
                  Delivery Address
                </h2>
              </div>
              <div className="font-semibold text-dark-700 space-y-1">
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p>{order.shippingAddress.addressLine2}</p>
                )}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p>PIN: {order.shippingAddress.pincode}</p>
                <p className="flex items-center gap-2 pt-2">
                  <Phone size={16} />
                  {order.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border-4 border-black p-6 sticky top-24">
              <h2 className="text-2xl font-display font-black text-dark-900 mb-6 uppercase">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between font-semibold">
                  <span className="text-dark-600">Items:</span>
                  <span className="text-dark-900">{order.items.length}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-dark-600">Subtotal:</span>
                  <span className="text-dark-900">₹{order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-dark-600">Delivery:</span>
                  <span className="text-green-600 font-black">FREE</span>
                </div>
                <div className="border-t-2 border-dark-900 pt-3 flex justify-between">
                  <span className="text-lg font-black text-dark-900 uppercase">Total:</span>
                  <span className="text-2xl font-black text-primary-500">
                    ₹{order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="border-t-2 border-dark-200 pt-4">
                <div className="flex items-center gap-3 mb-3">
                  <CreditCard size={20} className="text-dark-600" strokeWidth={2.5} />
                  <span className="font-bold text-dark-900 uppercase">Payment Method</span>
                </div>
                <p className="font-semibold text-dark-700">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
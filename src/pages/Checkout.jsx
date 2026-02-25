import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, User, CreditCard } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import API from '../services/api';

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    phone: user?.phone || '',
    paymentMethod: 'cod'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const orderData = {
        shippingAddress: {
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        phone: formData.phone,
        paymentMethod: formData.paymentMethod
      };

      const response = await API.post('/orders', orderData);
      
      await clearCart();
      alert('✓ Order placed successfully!');
      navigate(`/orders/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-primary-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-5xl font-display font-black text-dark-900 mb-8">
          CHECKOUT
        </h1>

        {error && (
          <div className="mb-6 bg-red-50 border-4 border-red-500 p-4">
            <p className="text-red-700 font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Delivery & Payment Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <div className="bg-white border-4 border-black p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary-500 border-2 border-black flex items-center justify-center">
                    <MapPin className="text-white" size={24} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-2xl font-display font-black text-dark-900 uppercase">
                    Delivery Address
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-black text-dark-900 mb-2 uppercase">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleChange}
                      required
                      placeholder="House/Flat No, Building Name"
                      className="w-full px-4 py-3 border-2 border-dark-900 focus:outline-none focus:border-primary-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black text-dark-900 mb-2 uppercase">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleChange}
                      placeholder="Street, Area, Landmark"
                      className="w-full px-4 py-3 border-2 border-dark-900 focus:outline-none focus:border-primary-500 font-semibold"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-black text-dark-900 mb-2 uppercase">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        placeholder="City"
                        className="w-full px-4 py-3 border-2 border-dark-900 focus:outline-none focus:border-primary-500 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-black text-dark-900 mb-2 uppercase">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        placeholder="State"
                        className="w-full px-4 py-3 border-2 border-dark-900 focus:outline-none focus:border-primary-500 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-black text-dark-900 mb-2 uppercase">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                        placeholder="123456"
                        maxLength={6}
                        className="w-full px-4 py-3 border-2 border-dark-900 focus:outline-none focus:border-primary-500 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-black text-dark-900 mb-2 uppercase">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="1234567890"
                        className="w-full px-4 py-3 border-2 border-dark-900 focus:outline-none focus:border-primary-500 font-semibold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white border-4 border-black p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary-500 border-2 border-black flex items-center justify-center">
                    <CreditCard className="text-white" size={24} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-2xl font-display font-black text-dark-900 uppercase">
                    Payment Method
                  </h2>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-dark-900 cursor-pointer hover:bg-primary-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="w-5 h-5 mr-4"
                    />
                    <div className="flex-1">
                      <p className="font-black text-dark-900">Cash on Delivery</p>
                      <p className="text-sm text-dark-600 font-semibold">Pay when you receive</p>
                    </div>
                    <span className="text-2xl">💵</span>
                  </label>

                  <label className="flex items-center p-4 border-2 border-dark-900 cursor-not-allowed opacity-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      disabled
                      className="w-5 h-5 mr-4"
                    />
                    <div className="flex-1">
                      <p className="font-black text-dark-900">Online Payment</p>
                      <p className="text-sm text-dark-600 font-semibold">Coming Soon!</p>
                    </div>
                    <span className="text-2xl">💳</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border-4 border-black p-6 sticky top-24">
                <h2 className="text-2xl font-display font-black text-dark-900 mb-6 uppercase">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.product._id} className="flex gap-3 pb-3 border-b-2 border-dark-200">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover border-2 border-black"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-sm text-dark-900 line-clamp-2">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-dark-600 font-semibold">
                          ₹{item.price} x {item.quantity}
                        </p>
                      </div>
                      <p className="font-black text-dark-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between font-semibold">
                    <span className="text-dark-600">Subtotal:</span>
                    <span className="text-dark-900">₹{cart.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-dark-600">Delivery:</span>
                    <span className="text-green-600 font-black">FREE</span>
                  </div>
                  <div className="border-t-2 border-dark-900 pt-3 flex justify-between">
                    <span className="text-lg font-black text-dark-900 uppercase">Total:</span>
                    <span className="text-2xl font-black text-primary-500">
                      ₹{cart.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-500 text-white py-4 font-black uppercase tracking-wider border-4 border-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'PLACING ORDER...' : 'PLACE ORDER'}
                </button>

                <p className="mt-4 text-xs text-center text-dark-600 font-semibold">
                  By placing order, you agree to our terms & conditions
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
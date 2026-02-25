import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import Navbar from '../components/Navbar';

function Cart() {
  const { cart, loading, updateCartItem, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleQuantityChange = async (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;

    await updateCartItem(productId, newQuantity);
  };

  const handleRemove = async (productId) => {
    if (window.confirm('Remove this item from cart?')) {
      await removeFromCart(productId);
    }
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

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-primary-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white border-4 border-black p-12 text-center">
            <div className="mb-8">
              <ShoppingBag size={80} className="mx-auto text-dark-300 mb-4" strokeWidth={2} />
              <h2 className="text-4xl font-display font-black text-dark-900 mb-4">
                YOUR CART IS EMPTY
              </h2>
              <p className="text-xl text-dark-600 font-semibold">
                Add some products to get started!
              </p>
            </div>
            <Link to="/products">
              <button className="bg-primary-500 text-white px-8 py-4 font-black uppercase tracking-wider border-4 border-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all inline-flex items-center gap-3">
                Start Shopping
                <ArrowRight size={20} strokeWidth={3} />
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
          <h1 className="text-5xl font-display font-black text-dark-900 mb-2">
            YOUR CART
          </h1>
          <p className="text-dark-600 font-semibold">
            {cart.items.length} item(s) in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.product._id}
                className="bg-white border-4 border-black p-4 hover:shadow-brutal transition-all"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-dark-100 border-2 border-black flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <Link to={`/products/${item.product._id}`}>
                      <h3 className="font-display font-black text-lg text-dark-900 hover:text-primary-600 transition-colors mb-1">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-dark-600 font-semibold mb-2">
                      {item.product.unit}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl font-black text-dark-900">
                        ₹{item.price}
                      </span>
                      <span className="text-sm text-dark-500 font-semibold">
                        x {item.quantity}
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border-2 border-black">
                        <button
                          onClick={() => handleQuantityChange(item.product._id, item.quantity, -1)}
                          className="px-3 py-2 hover:bg-dark-100 transition-colors font-bold"
                        >
                          <Minus size={16} strokeWidth={3} />
                        </button>
                        <span className="px-4 py-2 border-x-2 border-black font-black">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.product._id, item.quantity, 1)}
                          className="px-3 py-2 hover:bg-dark-100 transition-colors font-bold"
                        >
                          <Plus size={16} strokeWidth={3} />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item.product._id)}
                        className="p-2 border-2 border-red-500 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="text-2xl font-black text-dark-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border-4 border-black p-6 sticky top-24">
              <h2 className="text-2xl font-display font-black text-dark-900 mb-6 uppercase">
                Order Summary
              </h2>

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
                onClick={() => navigate('/checkout')}
                className="w-full bg-primary-500 text-white py-4 font-black uppercase tracking-wider border-4 border-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3 mb-4"
              >
                Checkout
                <ArrowRight size={20} strokeWidth={3} />
              </button>

              <Link to="/products">
                <button className="w-full bg-white text-dark-900 py-3 font-bold uppercase tracking-wider border-2 border-dark-900 hover:bg-dark-50 transition-all">
                  Continue Shopping
                </button>
              </Link>

              {/* Features */}
              <div className="mt-6 space-y-3 border-t-2 border-dark-200 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-500 border-2 border-black flex items-center justify-center">
                    <span className="text-sm">🔒</span>
                  </div>
                  <span className="text-sm font-bold text-dark-700">Secure Payment</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-500 border-2 border-black flex items-center justify-center">
                    <span className="text-sm">⚡</span>
                  </div>
                  <span className="text-sm font-bold text-dark-700">Fast Delivery</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-500 border-2 border-black flex items-center justify-center">
                    <span className="text-sm">💯</span>
                  </div>
                  <span className="text-sm font-bold text-dark-700">Quality Assured</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
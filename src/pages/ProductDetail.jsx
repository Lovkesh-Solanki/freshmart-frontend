import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import API from '../services/api';
import Navbar from '../components/Navbar';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const { addNotification } = useContext(NotificationContext);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await API.get(`/products/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  };

  const calculateFinalPrice = (price, discount) => {
    return discount > 0 ? price - (price * discount / 100) : price;
  };

  const handleQuantityChange = (type) => {
    if (type === 'increment' && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      if (window.confirm('Please login to add items to cart. Go to login page?')) {
        navigate('/login');
      }
      return;
    }

    if (quantity < 1 || quantity > product.stock) {
      addNotification(`Please select quantity between 1 and ${product.stock}`, 'warning', 3000);
      return;
    }

    setAddingToCart(true);

    const result = await addToCart(product._id, quantity);

    if (result.success) {
      addNotification(`${quantity} ${product.name} added to cart!`, 'success', 3000);
      setQuantity(1);
    } else {
      addNotification(result.message || 'Failed to add to cart', 'error', 3000);
    }

    setAddingToCart(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-primary-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white border-4 border-black p-12 text-center">
            <h2 className="text-4xl font-display font-black text-dark-900 mb-4">PRODUCT NOT FOUND</h2>
            <button
              onClick={() => navigate('/products')}
              className="bg-primary-500 text-white px-8 py-4 font-black uppercase border-4 border-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const finalPrice = calculateFinalPrice(product.price, product.discount);

  return (
    <div className="min-h-screen bg-primary-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="mb-6 text-primary-600 hover:text-primary-700 font-bold uppercase text-sm"
        >
          ← Back to Products
        </button>

        {/* Product Detail */}
        <div className="bg-white border-4 border-black overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="h-96 bg-dark-100 border-4 border-black overflow-hidden flex items-center justify-center">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-dark-400 text-xl font-bold">No Image Available</span>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* Category */}
              <div className="mb-4">
                <span className="inline-block bg-primary-500 text-white px-4 py-2 font-bold uppercase text-xs border-2 border-black">
                  {product.category?.name || 'Uncategorized'}
                </span>
              </div>

              <h1 className="text-5xl font-display font-black text-dark-900 mb-4">
                {product.name}
              </h1>

              {/* Description */}
              <p className="text-dark-600 mb-6 leading-relaxed font-semibold">
                {product.description}
              </p>

              {/* Unit */}
              <div className="mb-6 text-lg font-semibold text-dark-700">
                Unit: <span className="font-black">{product.unit}</span>
              </div>

              {/* Price */}
              <div className="mb-6 border-4 border-black p-4 bg-primary-50">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-5xl font-black text-dark-900">
                    ₹{finalPrice.toFixed(2)}
                  </span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-2xl text-dark-400 line-through font-bold">
                        ₹{product.price}
                      </span>
                      <span className="bg-accent-500 text-white px-4 py-2 font-black border-2 border-black">
                        {product.discount}% OFF
                      </span>
                    </>
                  )}
                </div>
                {product.discount > 0 && (
                  <p className="text-primary-600 font-bold text-sm">
                    You save ₹{(product.price - finalPrice).toFixed(2)}!
                  </p>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <p className="text-primary-600 font-black uppercase">
                    ✓ In Stock ({product.stock} available)
                  </p>
                ) : (
                  <p className="text-accent-600 font-black uppercase">
                    ✗ Out of Stock
                  </p>
                )}
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="mb-6">
                  <label className="block text-dark-900 font-black mb-3 uppercase">Quantity</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleQuantityChange('decrement')}
                      disabled={quantity <= 1}
                      className="w-12 h-12 bg-dark-100 border-2 border-black hover:bg-dark-200 disabled:opacity-50 disabled:cursor-not-allowed font-black text-lg"
                    >
                      −
                    </button>
                    <span className="text-4xl font-black w-16 text-center text-dark-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange('increment')}
                      disabled={quantity >= product.stock}
                      className="w-12 h-12 bg-dark-100 border-2 border-black hover:bg-dark-200 disabled:opacity-50 disabled:cursor-not-allowed font-black text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              {product.stock > 0 ? (
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="w-full bg-primary-500 text-white py-4 font-black uppercase text-lg tracking-wider border-4 border-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingToCart ? 'Adding to Cart...' : `Add to Cart - ₹${(finalPrice * quantity).toFixed(2)}`}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-dark-200 text-dark-500 py-4 font-black uppercase text-lg border-4 border-black cursor-not-allowed"
                >
                  Out of Stock
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
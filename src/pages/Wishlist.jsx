import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      if (window.confirm('Please login to add items to cart. Go to login page?')) {
        navigate('/login');
      }
      return;
    }

    const result = await addToCart(product._id, 1);
    
    if (result.success) {
      alert('✓ Added to cart!');
      // Optionally remove from wishlist after adding to cart
      // removeFromWishlist(product._id);
    } else {
      alert(result.message || 'Failed to add to cart');
    }
  };

  const handleRemove = (productId) => {
    removeFromWishlist(productId);
  };

  const handleClearAll = () => {
    if (window.confirm('Remove all items from wishlist?')) {
      clearWishlist();
    }
  };

  const calculateFinalPrice = (price, discount) => {
    return discount > 0 ? price - (price * discount / 100) : price;
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-primary-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white border-4 border-black p-12 text-center">
            <Heart size={80} className="mx-auto text-dark-300 mb-4" strokeWidth={2} />
            <h2 className="text-4xl font-display font-black text-dark-900 mb-4">
              YOUR WISHLIST IS EMPTY
            </h2>
            <p className="text-xl text-dark-600 font-semibold mb-8">
              Save your favorite products for later!
            </p>
            <Link to="/products">
              <button className="bg-primary-500 text-white px-8 py-4 font-black uppercase tracking-wider border-4 border-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all inline-flex items-center gap-3">
                Browse Products
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-display font-black text-dark-900 mb-2">
              YOUR WISHLIST
            </h1>
            <p className="text-dark-600 font-semibold">
              {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          <button
            onClick={handleClearAll}
            className="bg-white text-dark-900 px-6 py-3 font-bold uppercase text-sm border-2 border-dark-900 hover:bg-red-50 hover:text-red-600 hover:border-red-600 transition-all"
          >
            Clear All
          </button>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {wishlist.map((product) => {
            const finalPrice = calculateFinalPrice(product.price, product.discount);
            
            return (
              <div
                key={product._id}
                className="bg-white border-4 border-black hover:shadow-brutal transition-all relative"
              >
                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(product._id)}
                  className="absolute top-4 right-4 z-10 bg-white border-2 border-black p-2 hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Trash2 size={18} strokeWidth={2.5} />
                </button>

                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className="absolute top-4 left-4 bg-accent-500 text-white px-3 py-1 font-black text-sm border-2 border-black z-10">
                    -{product.discount}%
                  </div>
                )}

                <Link to={`/products/${product._id}`} className="block">
                  {/* Product Image */}
                  <div className="h-56 bg-dark-100 overflow-hidden border-b-4 border-black">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <p className="text-xs text-dark-500 uppercase tracking-wider font-bold mb-1">
                      {product.category?.name}
                    </p>

                    <h3 className="font-display font-black text-lg text-dark-900 mb-2 line-clamp-2 min-h-[56px]">
                      {product.name}
                    </h3>

                    <p className="text-sm text-dark-600 font-semibold mb-3">
                      {product.unit}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-4">
                      {product.discount > 0 && (
                        <span className="text-sm text-dark-400 line-through font-semibold">
                          ₹{product.price}
                        </span>
                      )}
                      <span className="text-2xl font-black text-dark-900">
                        ₹{Math.round(finalPrice)}
                      </span>
                    </div>

                    {/* Stock Status */}
                    {product.stock > 0 ? (
                      product.stock <= 10 ? (
                        <p className="text-xs text-accent-600 font-black uppercase mb-3">
                          ⚠ Only {product.stock} left!
                        </p>
                      ) : (
                        <p className="text-xs text-primary-600 font-black uppercase mb-3">
                          ✓ In Stock
                        </p>
                      )
                    ) : (
                      <p className="text-xs text-dark-500 font-black uppercase mb-3">
                        ✗ Out of Stock
                      </p>
                    )}
                  </div>
                </Link>

                {/* Add to Cart Button */}
                <div className="px-4 pb-4">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className={`w-full py-3 font-black uppercase text-sm tracking-wider border-2 border-black transition-all flex items-center justify-center gap-2 ${
                      product.stock === 0
                        ? 'bg-dark-200 text-dark-500 cursor-not-allowed'
                        : 'bg-primary-500 text-white shadow-brutal-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1'
                    }`}
                  >
                    <ShoppingCart size={18} strokeWidth={2.5} />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Shopping */}
        <div className="mt-8 text-center">
          <Link to="/products">
            <button className="bg-white text-dark-900 px-8 py-4 font-bold uppercase tracking-wider border-2 border-dark-900 hover:bg-dark-50 transition-all">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Wishlist;

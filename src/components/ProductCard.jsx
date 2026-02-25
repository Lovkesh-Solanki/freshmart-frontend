import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';

function ProductCard({ product, onAddToCart }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const finalPrice = product.price - (product.price * product.discount / 100);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    await onAddToCart(product._id, 1);
    setIsAdding(false);
  };

  return (
    <div className="bg-white border-4 border-black hover:shadow-brutal-lg transition-all group relative">
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsFavorite(!isFavorite);
        }}
        className="absolute top-4 right-4 z-10 bg-white border-2 border-black p-2 hover:bg-primary-500 hover:text-white transition-colors"
      >
        <Heart
          size={18}
          className={isFavorite ? 'fill-current' : ''}
          strokeWidth={2.5}
        />
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
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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

          <p className="text-sm text-dark-600 font-semibold mb-3">{product.unit}</p>

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
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAdding}
          className={`w-full py-3 font-black uppercase text-sm tracking-wider border-2 border-black transition-all flex items-center justify-center gap-2 ${
            product.stock === 0
              ? 'bg-dark-200 text-dark-500 cursor-not-allowed'
              : 'bg-primary-500 text-white shadow-brutal-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1'
          }`}
        >
          <ShoppingCart size={18} strokeWidth={2.5} />
          {isAdding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
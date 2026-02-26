import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import API from '../services/api';

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: 'createdAt'
  });
  
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await API.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sort) params.append('sort', filters.sort);

      const response = await API.get(`/products?${params.toString()}`);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      sort: 'createdAt'
    });
  };

  const handleAddToCart = async (productId, quantity) => {
    if (!isAuthenticated) {
      if (window.confirm('Please login to add items to cart. Go to login page?')) {
        navigate('/login');
      }
      return;
    }

    const result = await addToCart(productId, quantity);
    
    if (result.success) {
      alert('✓ Added to cart!');
    } else {
      alert(result.message || 'Failed to add to cart');
    }
  };

  return (
    <div className="min-h-screen bg-primary-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-64 bg-white border-4 border-black p-4 h-fit sticky top-24">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display font-black text-dark-800 uppercase">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-bold"
              >
                Clear
              </button>
            </div>

            {/* Search */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-dark-700 mb-2 uppercase">
                Search
              </label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search products..."
                className="w-full px-3 py-2 border-2 border-dark-900 focus:outline-none focus:border-primary-500"
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-dark-700 mb-2 uppercase">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border-2 border-dark-900 focus:outline-none focus:border-primary-500 font-semibold"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-dark-700 mb-2 uppercase">
                Price Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  className="w-1/2 px-3 py-2 border-2 border-dark-900 focus:outline-none focus:border-primary-500"
                />
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  className="w-1/2 px-3 py-2 border-2 border-dark-900 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-dark-700 mb-2 uppercase">
                Sort By
              </label>
              <select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border-2 border-dark-900 focus:outline-none focus:border-primary-500 font-semibold"
              >
                <option value="createdAt">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary-500"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white border-4 border-black p-8 text-center">
                <p className="text-dark-500 text-lg mb-4 font-bold">No products found</p>
                <button
                  onClick={clearFilters}
                  className="bg-primary-500 text-white px-6 py-2 border-2 border-black font-bold hover:shadow-brutal-sm transition-all"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-dark-600 font-bold">
                    Showing {products.length} product{products.length !== 1 ? 's' : ''}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <ProductCard 
                      key={product._id} 
                      product={product} 
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;

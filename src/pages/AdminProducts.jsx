import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import API from '../services/api';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await API.get('/products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await API.delete(`/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
        alert('✓ Product deleted!');
      } catch (error) {
        alert('Failed to delete');
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-primary-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-display font-black text-dark-900 mb-2">
              MANAGE PRODUCTS
            </h1>
            <p className="text-dark-600 font-semibold">
              {products.length} total products
            </p>
          </div>
          <button className="bg-primary-500 text-white px-6 py-3 font-black uppercase border-4 border-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-2">
            <Plus size={20} strokeWidth={3} />
            Add Product
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 bg-white border-4 border-black p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-400" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 border-2 border-dark-900 focus:outline-none focus:border-primary-500 font-semibold"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white border-4 border-black p-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover border-2 border-black mb-3"
              />
              <h3 className="font-black text-dark-900 mb-2 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-sm font-semibold text-dark-600 mb-2">
                Stock: {product.stock}
              </p>
              <p className="text-xl font-black text-primary-500 mb-3">
                ₹{product.price}
              </p>
              <div className="flex gap-2">
                <button className="flex-1 bg-white text-dark-900 py-2 font-bold text-sm border-2 border-dark-900 hover:bg-dark-50 transition-all flex items-center justify-center gap-1">
                  <Edit2 size={14} strokeWidth={2.5} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="flex-1 bg-red-500 text-white py-2 font-bold text-sm border-2 border-black hover:bg-red-600 transition-all flex items-center justify-center gap-1"
                >
                  <Trash2 size={14} strokeWidth={2.5} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;
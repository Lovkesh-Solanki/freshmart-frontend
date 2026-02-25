import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FolderOpen } from 'lucide-react';
import Navbar from '../components/Navbar';
import API from '../services/api';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await API.get('/categories');
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/categories/${editingId}`, formData);
        alert('✓ Category updated!');
      } else {
        await API.post('/categories', formData);
        alert('✓ Category created!');
      }
      setFormData({ name: '', description: '' });
      setEditingId(null);
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      alert('Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await API.delete(`/categories/${id}`);
        alert('✓ Category deleted!');
        fetchCategories();
      } catch (error) {
        alert('Failed to delete');
      }
    }
  };

  const handleEdit = (category) => {
    setFormData({ name: category.name, description: category.description });
    setEditingId(category._id);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-primary-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-display font-black text-dark-900 mb-2">
              MANAGE CATEGORIES
            </h1>
            <p className="text-dark-600 font-semibold">
              {categories.length} total categories
            </p>
          </div>
          <button
            onClick={() => {
              setFormData({ name: '', description: '' });
              setEditingId(null);
              setShowModal(true);
            }}
            className="bg-primary-500 text-white px-6 py-3 font-black uppercase border-4 border-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-2"
          >
            <Plus size={20} strokeWidth={3} />
            Add Category
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div key={category._id} className="bg-white border-4 border-black p-6">
              <div className="w-16 h-16 bg-primary-500 border-2 border-black flex items-center justify-center mb-4">
                <FolderOpen className="text-white" size={32} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-black text-dark-900 mb-2">
                {category.name}
              </h3>
              <p className="text-sm font-semibold text-dark-600 mb-4">
                {category.description || 'No description'}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="flex-1 bg-white text-dark-900 py-2 font-bold text-sm border-2 border-dark-900 hover:bg-dark-50 transition-all flex items-center justify-center gap-1"
                >
                  <Edit2 size={14} strokeWidth={2.5} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="flex-1 bg-red-500 text-white py-2 font-bold text-sm border-2 border-black hover:bg-red-600 transition-all flex items-center justify-center gap-1"
                >
                  <Trash2 size={14} strokeWidth={2.5} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white border-4 border-black p-6 max-w-md w-full">
              <h2 className="text-2xl font-black text-dark-900 mb-4 uppercase">
                {editingId ? 'Edit Category' : 'Add Category'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-black text-dark-900 mb-2 uppercase">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="w-full px-4 py-3 border-2 border-dark-900 focus:outline-none focus:border-primary-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-dark-900 mb-2 uppercase">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-dark-900 focus:outline-none focus:border-primary-500 font-semibold"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-500 text-white py-3 font-black uppercase border-2 border-black shadow-brutal-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                  >
                    {editingId ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-white text-dark-900 py-3 font-bold uppercase border-2 border-dark-900 hover:bg-dark-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCategories;
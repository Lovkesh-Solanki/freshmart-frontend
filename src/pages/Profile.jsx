import { useContext, useState } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Save, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

function Profile() {
  const { user, updateProfile } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateProfile(formData);
    
    if (result.success) {
      alert('✓ Profile updated successfully!');
      setIsEditing(false);
    } else {
      alert(result.message || 'Failed to update profile');
    }
    
    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-primary-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-5xl font-display font-black text-dark-900 mb-8">
          YOUR PROFILE
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white border-4 border-black p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-500 border-2 border-black flex items-center justify-center">
                    <User className="text-white" size={24} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-2xl font-display font-black text-dark-900 uppercase">
                    Personal Information
                  </h2>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-dark-900 font-bold hover:bg-dark-50 transition-colors"
                  >
                    <Edit2 size={16} strokeWidth={2.5} />
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-black text-dark-900 mb-2 uppercase">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-dark-900 focus:outline-none focus:border-primary-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black text-dark-900 mb-2 uppercase">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-dark-900 focus:outline-none focus:border-primary-500 font-semibold"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-primary-500 text-white py-3 font-black uppercase border-2 border-black shadow-brutal-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Save size={18} strokeWidth={2.5} />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 bg-white text-dark-900 py-3 font-bold uppercase border-2 border-dark-900 hover:bg-dark-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <X size={18} strokeWidth={2.5} />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-dark-500 font-bold uppercase mb-1">Name</p>
                    <p className="text-lg font-black text-dark-900">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-dark-500 font-bold uppercase mb-1">Email</p>
                    <p className="text-lg font-semibold text-dark-900">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-dark-500 font-bold uppercase mb-1">Phone</p>
                    <p className="text-lg font-semibold text-dark-900">{user?.phone}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Saved Addresses */}
            <div className="bg-white border-4 border-black p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary-500 border-2 border-black flex items-center justify-center">
                  <MapPin className="text-white" size={24} strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-display font-black text-dark-900 uppercase">
                  Saved Addresses
                </h2>
              </div>

              {user?.addresses && user.addresses.length > 0 ? (
                <div className="space-y-4">
                  {user.addresses.map((address, index) => (
                    <div key={index} className="border-2 border-dark-900 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-black text-dark-900 uppercase">Address {index + 1}</p>
                      </div>
                      <div className="font-semibold text-dark-700 space-y-1 text-sm">
                        <p>{address.addressLine1}</p>
                        {address.addressLine2 && <p>{address.addressLine2}</p>}
                        <p>{address.city}, {address.state}</p>
                        <p>PIN: {address.pincode}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-dark-50 border-2 border-dark-200">
                  <MapPin size={40} className="mx-auto text-dark-300 mb-3" strokeWidth={2} />
                  <p className="text-dark-600 font-bold">
                    No saved addresses yet
                  </p>
                  <p className="text-sm text-dark-500 font-semibold mt-1">
                    Add an address during checkout
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Account Stats */}
          <div className="lg:col-span-1">
            <div className="bg-white border-4 border-black p-6 sticky top-24">
              <h2 className="text-2xl font-display font-black text-dark-900 mb-6 uppercase">
                Account Info
              </h2>

              <div className="space-y-4">
                <div className="border-2 border-dark-900 p-4 text-center">
                  <p className="text-3xl font-black text-primary-500 mb-1">
                    {user?.role === 'admin' ? '∞' : '0'}
                  </p>
                  <p className="text-sm font-bold text-dark-600 uppercase">Total Orders</p>
                </div>

                <div className="border-2 border-dark-900 p-4">
                  <p className="text-sm font-bold text-dark-600 uppercase mb-2">Account Type</p>
                  <span className={`inline-block px-3 py-1 font-black text-sm uppercase border-2 ${
                    user?.role === 'admin'
                      ? 'bg-primary-100 text-primary-800 border-primary-500'
                      : 'bg-blue-100 text-blue-800 border-blue-500'
                  }`}>
                    {user?.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </div>

                <div className="border-2 border-dark-900 p-4">
                  <p className="text-sm font-bold text-dark-600 uppercase mb-2">Member Since</p>
                  <p className="font-black text-dark-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
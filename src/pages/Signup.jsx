import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

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

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.phone
    );

    if (result.success) {
      navigate('/products');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <div className="hidden md:block">
            <div className="bg-gradient-to-br from-primary-500 to-accent-500 border-4 border-black p-12 transform rotate-2">
              <div className="transform -rotate-2">
                <h1 className="text-6xl font-display font-black text-white mb-6">
                  JOIN<br />FRESHMART
                </h1>
                <p className="text-xl text-white mb-8 font-semibold">
                  Create an account and start shopping today!
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center">
                      <span className="text-2xl">🎁</span>
                    </div>
                    <span className="text-white font-bold">Welcome Offers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <span className="text-white font-bold">Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center">
                      <span className="text-2xl">💯</span>
                    </div>
                    <span className="text-white font-bold">Quality Products</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="bg-white border-4 border-black p-8 shadow-brutal-lg">
            <div className="mb-8">
              <h2 className="text-4xl font-display font-black text-dark-900 mb-2">
                SIGN UP
              </h2>
              <p className="text-dark-600 font-semibold">
                Create your account in just a few steps
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border-4 border-red-500 p-4">
                <p className="text-red-700 font-bold">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-black text-dark-900 mb-2 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-400" size={20} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 border-2 border-dark-900 focus:outline-none focus:border-primary-500 font-semibold"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-black text-dark-900 mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full pl-12 pr-4 py-3 border-2 border-dark-900 focus:outline-none focus:border-primary-500 font-semibold"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-black text-dark-900 mb-2 uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-400" size={20} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="1234567890"
                    className="w-full pl-12 pr-4 py-3 border-2 border-dark-900 focus:outline-none focus:border-primary-500 font-semibold"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-black text-dark-900 mb-2 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-400" size={20} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    minLength={6}
                    className="w-full pl-12 pr-4 py-3 border-2 border-dark-900 focus:outline-none focus:border-primary-500 font-semibold"
                  />
                </div>
                <p className="mt-2 text-xs text-dark-500 font-semibold">
                  Minimum 6 characters
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-500 text-white py-4 font-black uppercase tracking-wider border-4 border-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
                {!loading && <ArrowRight size={20} strokeWidth={3} />}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-dark-600 font-semibold">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 font-black hover:text-primary-700 uppercase">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
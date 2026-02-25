import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
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

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Check if admin
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/products');
      }
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
            <div className="bg-dark-900 border-4 border-black p-12 transform -rotate-2">
              <div className="transform rotate-2">
                <h1 className="text-6xl font-display font-black text-white mb-6">
                  WELCOME<br />BACK!
                </h1>
                <p className="text-xl text-dark-300 mb-8 font-semibold">
                  Login to continue shopping fresh groceries
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-500 border-2 border-white flex items-center justify-center">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <span className="text-white font-bold">10-Min Delivery</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-500 border-2 border-white flex items-center justify-center">
                      <span className="text-2xl">🛒</span>
                    </div>
                    <span className="text-white font-bold">1000+ Products</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-500 border-2 border-white flex items-center justify-center">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <span className="text-white font-bold">100% Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="bg-white border-4 border-black p-8 shadow-brutal-lg">
            <div className="mb-8">
              <h2 className="text-4xl font-display font-black text-dark-900 mb-2">
                LOGIN
              </h2>
              <p className="text-dark-600 font-semibold">
                Enter your credentials to access your account
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border-4 border-red-500 p-4">
                <p className="text-red-700 font-bold">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="w-full pl-12 pr-4 py-3 border-2 border-dark-900 focus:outline-none focus:border-primary-500 font-semibold"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-500 text-white py-4 font-black uppercase tracking-wider border-4 border-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? 'LOGGING IN...' : 'LOGIN'}
                {!loading && <ArrowRight size={20} strokeWidth={3} />}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-dark-600 font-semibold">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary-600 font-black hover:text-primary-700 uppercase">
                  Sign Up
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 bg-primary-50 border-2 border-primary-500 p-4">
              <p className="text-sm font-bold text-dark-700 mb-2 uppercase">Demo Credentials:</p>
              <div className="space-y-1 text-sm">
                <p className="font-semibold">
                  <span className="text-dark-500">User:</span> user@test.com / user123
                </p>
                <p className="font-semibold">
                  <span className="text-dark-500">Admin:</span> admin@blinkit.com / admin123
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
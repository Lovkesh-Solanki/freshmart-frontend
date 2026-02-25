import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Package, Shield, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';

function Home() {
  const features = [
    {
      icon: Clock,
      title: '10-Min Delivery',
      description: 'Lightning fast to your door',
    },
    {
      icon: Package,
      title: '1000+ Products',
      description: 'Fresh daily essentials',
    },
    {
      icon: Shield,
      title: '100% Secure',
      description: 'Safe payments guaranteed',
    },
    {
      icon: Zap,
      title: 'Free Delivery',
      description: 'No charges above ₹200',
    },
  ];

  const categories = [
    { name: 'Vegetables', emoji: '🥬', bg: 'bg-green-100' },
    { name: 'Fruits', emoji: '🍎', bg: 'bg-red-100' },
    { name: 'Dairy', emoji: '🥛', bg: 'bg-blue-100' },
    { name: 'Snacks', emoji: '🍿', bg: 'bg-yellow-100' },
    { name: 'Beverages', emoji: '🥤', bg: 'bg-purple-100' },
    { name: 'Bakery', emoji: '🍞', bg: 'bg-orange-100' },
    { name: 'Meat', emoji: '🍖', bg: 'bg-pink-100' },
    { name: 'Sweets', emoji: '🍰', bg: 'bg-rose-100' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <Navbar />

      {/* Hero Section - Brutalist Style */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div>
            <div className="inline-block bg-primary-500 text-white px-4 py-2 font-bold uppercase text-sm mb-6 border-2 border-black shadow-brutal-sm">
              ⚡ Fast & Fresh
            </div>
            
            <h1 className="text-7xl font-display font-black mb-6 leading-none">
              <span className="text-dark-900">GROCERIES</span>
              <br />
              <span className="text-primary-500">IN 10 MIN</span>
            </h1>
            
            <p className="text-xl text-dark-700 mb-8 font-semibold">
              Fresh vegetables, fruits & daily essentials delivered to your doorstep
            </p>

            <div className="flex gap-4">
              <Link to="/products">
                <button className="bg-primary-500 text-white px-8 py-4 font-bold uppercase tracking-wider border-4 border-black shadow-brutal-lg hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all flex items-center gap-3">
                  Start Shopping
                  <ArrowRight size={20} strokeWidth={3} />
                </button>
              </Link>
              <Link to="/products">
                <button className="bg-white text-dark-900 px-8 py-4 font-bold uppercase tracking-wider border-4 border-black shadow-brutal-lg hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all">
                  View Products
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column - Geometric Shape */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-primary-500 transform rotate-3 border-4 border-black"></div>
            <div className="relative bg-dark-900 border-4 border-black p-8 transform -rotate-2">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=600&fit=crop"
                alt="Fresh Groceries"
                className="w-full h-96 object-cover border-4 border-white"
              />
              <div className="absolute -bottom-6 -right-6 bg-accent-500 text-white px-6 py-4 font-black text-2xl border-4 border-black shadow-brutal">
                50% OFF
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features - Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white border-4 border-black p-6 hover:shadow-brutal transition-all group"
              >
                <div className="bg-primary-500 w-16 h-16 flex items-center justify-center mb-4 border-2 border-black group-hover:rotate-12 transition-transform">
                  <Icon className="text-white" size={32} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-display font-black text-dark-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-dark-600 font-semibold">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Categories - Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-5xl font-display font-black mb-12 text-dark-900">
          SHOP BY <span className="text-primary-500">CATEGORY</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Link key={index} to="/products">
              <div className={`${category.bg} border-4 border-black p-8 hover:shadow-brutal-lg transition-all cursor-pointer group`}>
                <div className="text-6xl mb-3 group-hover:scale-110 transition-transform">
                  {category.emoji}
                </div>
                <p className="font-display font-black text-lg text-dark-900">
                  {category.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-dark-900 border-4 border-black p-12 md:p-16 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-5xl font-display font-black text-white mb-6">
              READY TO START?
            </h2>
            <p className="text-xl text-dark-300 mb-8 max-w-2xl mx-auto font-semibold">
              Join thousands getting fresh groceries in 10 minutes
            </p>
            <Link to="/signup">
              <button className="bg-primary-500 text-white px-12 py-5 font-black uppercase text-lg tracking-wider border-4 border-white shadow-brutal-lg hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all">
                Sign Up Now →
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark-900 border-t-4 border-primary-500 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-dark-400 font-semibold">
            © 2026 FreshMart. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
import { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(recent.slice(0, 5));
  }, []);

  // Fetch suggestions
  useEffect(() => {
    if (query.length >= 2) {
      const timer = setTimeout(async () => {
        setLoading(true);
        try {
          const response = await API.get(`/products?search=${query}&limit=5`);
          setSuggestions(response.data);
        } catch (error) {
          console.error('Search error:', error);
        }
        setLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery) => {
    if (searchQuery.trim()) {
      // Save to recent searches
      const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      const updated = [searchQuery, ...recent.filter(s => s !== searchQuery)].slice(0, 10);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      setRecentSearches(updated.slice(0, 5));

      onSearch(searchQuery);
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    onSearch('');
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
          placeholder="Search for products..."
          className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-full focus:border-green-500 focus:outline-none transition-colors"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (query || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          >
            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Clock size={16} />
                  <span className="font-medium">Recent Searches</span>
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(search);
                      handleSearch(search);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin mx-auto w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full" />
                <p className="mt-2 text-sm">Searching...</p>
              </div>
            )}

            {/* Suggestions */}
            {!loading && suggestions.length > 0 && (
              <div className="max-h-96 overflow-y-auto">
                <div className="p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <TrendingUp size={16} />
                    <span className="font-medium">Suggestions</span>
                  </div>
                  {suggestions.map((product) => (
                    <button
                      key={product._id}
                      onClick={() => handleSearch(product.name)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.unit}</p>
                      </div>
                      <p className="font-bold text-green-600">₹{product.price}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {!loading && query && suggestions.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <p>No products found for "{query}"</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchBar;
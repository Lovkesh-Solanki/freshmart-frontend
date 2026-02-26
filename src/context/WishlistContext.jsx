import { createContext, useState, useEffect } from 'react';

// Create Context
export const WishlistContext = createContext();

// Provider Component
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('freshmart_wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
    setLoading(false);
  }, []);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('freshmart_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, loading]);

  // Add to wishlist
  const addToWishlist = (product) => {
    const exists = wishlist.find(item => item._id === product._id);
    
    if (exists) {
      return { success: false, message: 'Already in wishlist' };
    }

    setWishlist([...wishlist, product]);
    return { success: true, message: 'Added to wishlist' };
  };

  // Remove from wishlist
  const removeFromWishlist = (productId) => {
    setWishlist(wishlist.filter(item => item._id !== productId));
    return { success: true, message: 'Removed from wishlist' };
  };

  // Toggle wishlist (add if not exists, remove if exists)
  const toggleWishlist = (product) => {
    const exists = wishlist.find(item => item._id === product._id);
    
    if (exists) {
      return removeFromWishlist(product._id);
    } else {
      return addToWishlist(product);
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  // Get wishlist count
  const getWishlistCount = () => {
    return wishlist.length;
  };

  // Clear wishlist
  const clearWishlist = () => {
    setWishlist([]);
    return { success: true };
  };

  // Context value
  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getWishlistCount,
    clearWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;

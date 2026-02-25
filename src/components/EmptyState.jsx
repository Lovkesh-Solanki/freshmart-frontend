import { motion } from 'framer-motion';
import { ShoppingCart, Package, Search, Heart } from 'lucide-react';

const emptyStates = {
  cart: {
    icon: ShoppingCart,
    title: 'Your cart is empty',
    description: 'Looks like you haven\'t added anything to your cart yet',
    action: 'Start Shopping',
    link: '/products',
  },
  orders: {
    icon: Package,
    title: 'No orders yet',
    description: 'You haven\'t placed any orders. Start shopping now!',
    action: 'Browse Products',
    link: '/products',
  },
  search: {
    icon: Search,
    title: 'No products found',
    description: 'Try adjusting your search or filters',
    action: 'Clear Filters',
  },
  wishlist: {
    icon: Heart,
    title: 'Your wishlist is empty',
    description: 'Save your favorite products for later',
    action: 'Explore Products',
    link: '/products',
  },
};

function EmptyState({ type = 'cart', onAction }) {
  const state = emptyStates[type];
  const Icon = state.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {/* Animated Icon */}
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="mb-6"
      >
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-full">
          <Icon size={64} className="text-gray-400" />
        </div>
      </motion.div>

      {/* Text */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {state.title}
      </h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        {state.description}
      </p>

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAction}
        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow"
      >
        {state.action}
      </motion.button>
    </motion.div>
  );
}

export default EmptyState;
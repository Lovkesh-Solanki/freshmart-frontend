import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';

function FormInput({
  label,
  error,
  success,
  icon: Icon,
  ...props
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon size={20} />
          </div>
        )}
        
        <input
          {...props}
          className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-12 py-3 border-2 rounded-xl transition-all duration-200 ${
            error
              ? 'border-red-300 focus:border-red-500 bg-red-50'
              : success
              ? 'border-green-300 focus:border-green-500 bg-green-50'
              : 'border-gray-200 focus:border-green-500 bg-white'
          } focus:outline-none`}
        />
        
        {(error || success) && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
          >
            {error ? (
              <AlertCircle size={20} className="text-red-500" />
            ) : (
              <CheckCircle size={20} className="text-green-500" />
            )}
          </motion.div>
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600 flex items-center gap-1"
        >
          <AlertCircle size={14} />
          {error}
        </motion.p>
      )}
      
      {success && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-green-600 flex items-center gap-1"
        >
          <CheckCircle size={14} />
          {success}
        </motion.p>
      )}
    </div>
  );
}

export default FormInput;
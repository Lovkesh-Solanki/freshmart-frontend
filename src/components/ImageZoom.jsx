import { motion } from 'framer-motion';
import { useState } from 'react';

function ImageZoom({ src, alt, className }) {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div
      className={`relative overflow-hidden cursor-zoom-in ${className}`}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        animate={{
          scale: isZoomed ? 1.5 : 1,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeOut',
        }}
      />
    </div>
  );
}

export default ImageZoom;
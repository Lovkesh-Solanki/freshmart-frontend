import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      {/* Image skeleton */}
      <Skeleton height={160} className="rounded-lg mb-3" />
      
      {/* Title skeleton */}
      <Skeleton height={20} className="mb-2" />
      
      {/* Price skeleton */}
      <div className="flex justify-between items-center mb-3">
        <Skeleton width={60} height={24} />
        <Skeleton width={50} height={20} />
      </div>
      
      {/* Button skeleton */}
      <Skeleton height={40} className="rounded-lg" />
    </div>
  );
}

export default ProductCardSkeleton;
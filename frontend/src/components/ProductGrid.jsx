import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";

// Placeholder card shown while the catalogue is loading
const SkeletonCard = () => (
  <li aria-hidden="true">
    <div className="relative aspect-[13/15] overflow-hidden bg-gray-100">
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent motion-safe:animate-shimmer" />
    </div>
    <div className="mt-3 h-3 w-4/5 rounded bg-gray-100" />
    <div className="mt-2 h-3 w-1/3 rounded bg-gray-100" />
  </li>
);

// Responsive product list shared by every product listing. A real list lets
// screen readers announce how many products are shown.
const ProductGrid = ({
  products,
  className = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
  skeletonCount = 10,
  ...rest
}) => {
  const { isLoadingProducts } = useContext(ShopContext);
  const showSkeleton = isLoadingProducts && products.length === 0;

  return (
    <ul
      role="list"
      className={`grid gap-x-3 gap-y-8 sm:gap-x-4 ${className}`}
      aria-busy={showSkeleton || undefined}
      {...rest}
    >
      {showSkeleton
        ? Array.from({ length: skeletonCount }, (_, i) => (
            <SkeletonCard key={i} />
          ))
        : products.map((item, index) => (
            <li
              key={item._id}
              data-reveal
              style={{ "--reveal-delay": `${(index % 5) * 60}ms` }}
            >
              <ProductItem
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
              />
            </li>
          ))}
    </ul>
  );
};

export default ProductGrid;

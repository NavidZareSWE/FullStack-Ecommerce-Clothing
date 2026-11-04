import { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductGrid from "./ProductGrid";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const bestSeller = useMemo(() => {
    const bestproduct = products.filter((item) => {
      return item.bestseller === true;
    });
    return bestproduct.slice(0, 5);
  }, [products]);
  return (
    <section className="my-10" aria-labelledby="bestseller-heading">
      <div data-reveal className="py-8 text-center text-2xl sm:text-3xl">
        <Title id="bestseller-heading" text1={`BEST`} text2={`SELLERS`} />
        <p className="m-auto max-w-2xl text-sm text-gray-600 md:text-base">
          Discover the top-selling items that our customers love! Shop our
          bestsellers now and find your new favorites among these highly-rated
          and popular picks.
        </p>
      </div>
      <ProductGrid products={bestSeller} aria-labelledby="bestseller-heading" />
    </section>
  );
};

export default BestSeller;

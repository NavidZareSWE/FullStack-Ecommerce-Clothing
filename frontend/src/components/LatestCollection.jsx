import { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title.jsx";
import ProductGrid from "./ProductGrid.jsx";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const latestProducts = useMemo(() => products.slice(0, 10), [products]);

  return (
    <section className="my-10" aria-labelledby="latest-heading">
      <div data-reveal className="py-8 text-center text-2xl sm:text-3xl">
        <Title id="latest-heading" text1={`LATEST`} text2={`COLLECTIONS`} />
        <p className="m-auto max-w-2xl text-sm text-gray-600 md:text-base">
          Explore our latest collections, featuring contemporary designs and
          timeless classics crafted with the finest materials to elevate your
          style. Don&apos;t miss out on the season&apos;s trends—shop now and
          find your next favorite outfit!
        </p>
      </div>
      <ProductGrid products={latestProducts} aria-labelledby="latest-heading" />
    </section>
  );
};

export default LatestCollection;

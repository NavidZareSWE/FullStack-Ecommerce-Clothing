import { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductGrid from "./ProductGrid";

const RelatedProducts = ({ id, category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const related = useMemo(() => {
    if (products.length === 0) return [];
    let productsCopy = structuredClone(products);
    productsCopy = productsCopy.filter((item) => category === item.category);
    productsCopy = productsCopy.filter(
      (item) => subCategory === item.subCategory,
    );
    productsCopy = productsCopy.filter((item) => id !== item._id);
    return productsCopy.slice(0, 5);
  }, [products, id, category, subCategory]);

  if (related.length === 0) return null;

  return (
    <section className="my-16 sm:my-24" aria-labelledby="related-heading">
      <div data-reveal className="py-2 text-center text-2xl sm:text-3xl">
        <Title id="related-heading" text1={"RELATED"} text2={"PRODUCTS"} />
      </div>
      <ProductGrid products={related} aria-labelledby="related-heading" />
    </section>
  );
};

export default RelatedProducts;

import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, isLoadingProducts } =
    useContext(ShopContext);
  // The page remounts for every product (see App.jsx), so size and image
  // selections start fresh for each product.
  const productData = useMemo(
    () => products.find((product) => product._id === productId) || false,
    [products, productId],
  );
  const [selectedImage, setImage] = useState("");
  const image =
    productData && productData.image.includes(selectedImage)
      ? selectedImage
      : productData && productData.image[0];
  const [size, setSize] = useState("");
  const [sizeError, setSizeError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // "Added" confirmation on the button disappears after a moment
  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 1800);
    return () => clearTimeout(t);
  }, [justAdded]);

  // Still loading the catalogue
  if (!productData && isLoadingProducts) {
    return (
      <div
        className="flex min-h-[50vh] items-center justify-center pt-10"
        role="status"
      >
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black motion-reduce:animate-none" />
        <span className="sr-only">Loading product…</span>
      </div>
    );
  }

  // Catalogue loaded, but the product doesn't exist
  if (!productData) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 pt-10 text-center">
        <h1 className="text-2xl font-medium text-gray-900">
          Product not found
        </h1>
        <p className="text-gray-600">
          This product may have been removed or the link is incorrect.
        </p>
        <Link to="/collection" className="btn-primary">
          Browse the collection
        </Link>
      </div>
    );
  }

  const onAddToCart = () => {
    setSizeError(!size);
    if (size) setJustAdded(true);
    addToCart(productData._id, size);
  };

  return (
    <div className="pt-6 sm:pt-10">
      {/*----------------------- Product Data/Features -----------------------*/}
      <div className="flex flex-col gap-8 sm:flex-row sm:gap-12">
        {/*----------------------- Product Images -----------------------*/}
        <div className="flex flex-1 flex-col-reverse gap-3 sm:flex-row">
          {productData.image.length > 1 && (
            <ul
              role="list"
              aria-label="Product images"
              className="flex w-full gap-2 overflow-x-auto pb-1 sm:w-[18.7%] sm:flex-col sm:gap-3 sm:overflow-y-auto sm:pb-0"
            >
              {productData.image.map((item, index) => (
                <li key={index} className="w-[23%] flex-shrink-0 sm:w-full">
                  <button
                    type="button"
                    onClick={() => setImage(item)}
                    aria-label={`Show image ${index + 1} of ${productData.image.length}`}
                    aria-pressed={item === image}
                    className={`block w-full overflow-hidden border-2 transition duration-200 active:scale-95 ${
                      item === image
                        ? "border-black"
                        : "border-transparent hover:border-gray-400"
                    }`}
                  >
                    <img src={item} className="w-full" alt="" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="w-full sm:flex-1">
            <img
              key={image}
              className="h-auto w-full animate-fade-in"
              src={image}
              alt={productData.name}
              fetchPriority="high"
            />
          </div>
        </div>
        {/* ----------------------- Product info    -----------------------*/}
        <div className="flex-1">
          <h1 className="mt-2 text-2xl font-medium text-gray-900 sm:text-3xl">
            {productData.name}
          </h1>
          <div className="mt-2 flex items-center gap-1">
            <span className="sr-only">Rated 4 out of 5 stars.</span>
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_dull_icon} alt="" className="w-3.5" />
            <p className="pl-2 text-gray-700">
              (122)<span className="sr-only"> reviews</span>
            </p>
          </div>
          <p className="mt-4 text-3xl font-medium text-gray-900">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 leading-relaxed text-gray-600 md:w-4/5">
            {productData.description}
          </p>
          <fieldset className="my-8">
            <legend className="mb-4 font-medium text-gray-900">
              Select Size
            </legend>
            <div className="flex flex-wrap gap-2">
              {productData.sizes.map((item, index) => {
                return (
                  <button
                    type="button"
                    onClick={() => {
                      setSize(item);
                      setSizeError(false);
                    }}
                    aria-pressed={item === size}
                    aria-describedby={sizeError ? "size-error" : undefined}
                    className={`min-h-11 min-w-12 border px-3 py-2 text-sm font-medium transition duration-200 active:scale-95 ${
                      item === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 bg-gray-100 text-gray-900 hover:border-gray-900"
                    }`}
                    key={index}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
            {sizeError && (
              <p
                id="size-error"
                className="form-error animate-fade-in"
                role="alert"
              >
                Please select a size first.
              </p>
            )}
          </fieldset>
          <button
            type="button"
            onClick={onAddToCart}
            className="btn-primary w-full sm:w-auto"
          >
            {justAdded ? (
              <>
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4 animate-pop-in"
                  aria-hidden="true"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 10.5l3.5 3.5 7.5-8"
                  />
                </svg>
                ADDED TO CART
              </>
            ) : (
              "ADD TO CART"
            )}
          </button>
          <p className="sr-only" role="status">
            {justAdded
              ? `${productData.name}, size ${size}, added to cart.`
              : ""}
          </p>
          <hr className="mt-8 sm:w-4/5" />
          <ul className="mt-5 flex flex-col gap-1 text-sm text-gray-600">
            <li>100% Original product.</li>
            <li>Cash on delivery is available on this product.</li>
            <li>Easy return and exchange policy within 7 days.</li>
          </ul>
        </div>
      </div>
      {/* ------------ Description & Review Section ------------*/}
      <section className="mt-16 sm:mt-20" aria-labelledby="description-heading">
        <div className="flex flex-wrap">
          <h2
            id="description-heading"
            className="border border-b-0 px-4 py-3 text-sm font-bold sm:px-5"
          >
            Description
          </h2>
          <p className="border border-b-0 border-l-0 px-4 py-3 text-sm text-gray-700 sm:px-5">
            Reviews (122)
          </p>
        </div>
        <div className="flex flex-col gap-4 border px-4 py-6 text-sm leading-relaxed text-gray-600 sm:px-6">
          <p>
            An E-commerce website is an online platform that facilitates the
            buying and selling of products or services over the internet. It
            serves as virtual marketplace where businesses and individuals can
            showcase their products, interact with customers, and conduct
            transactions without the need for a physical presence. E-commerce
            websites have gained immense popularity due to their convenience,
            accessibility, and the global reach they offer.
          </p>
          <p>
            E-commerce websites typically display products or services along
            with detailed descriptions, images, prices, and any available
            variations (e.g., sizes, colors). Each product usually has its own
            dedicated page with relevant information.
          </p>
        </div>
      </section>
      {/* ------------ Display related products ------------*/}
      <RelatedProducts
        id={productData._id}
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;

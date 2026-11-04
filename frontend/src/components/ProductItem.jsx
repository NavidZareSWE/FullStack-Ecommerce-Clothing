import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);
  const [loaded, setLoaded] = useState(false);

  return (
    <Link
      className="group flex h-full flex-col rounded-sm text-gray-700"
      to={`/product/${id}`}
    >
      <div className="aspect-[13/15] overflow-hidden bg-gray-100">
        <img
          className={`h-full w-full object-cover object-center transition duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          src={image[0]}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          // Cached images may finish loading before React attaches onLoad
          ref={(img) => {
            if (img?.complete && img.naturalWidth > 0 && !loaded)
              setLoaded(true);
          }}
        />
      </div>
      <p className="line-clamp-2 pb-1 pt-3 text-sm decoration-gray-400 underline-offset-2 group-hover:underline">
        {name}
      </p>
      <p className="text-sm font-medium text-gray-900">
        {currency}
        {price}
      </p>
    </Link>
  );
};

export default ProductItem;

import { useContext, useMemo, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import CartTotal from "../components/CartTotal";

const MIN_QTY = 1;
const MAX_QTY = 999;

// Quantity field with large −/+ buttons for touch screens. Typing a value
// keeps the original behaviour: empty / 0 is ignored, any other number
// updates the cart immediately.
const QuantityControl = ({ id, quantity, label, onChange }) => {
  const [value, setValue] = useState(String(quantity));
  // Keep the field in sync when the cart changes elsewhere
  const [prevQuantity, setPrevQuantity] = useState(quantity);
  if (prevQuantity !== quantity) {
    setPrevQuantity(quantity);
    setValue(String(quantity));
  }

  const commit = (next) => {
    const clamped = Math.min(MAX_QTY, Math.max(MIN_QTY, next));
    setValue(String(clamped));
    if (clamped !== quantity) onChange(clamped);
  };

  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={() => commit(quantity - 1)}
        disabled={quantity <= MIN_QTY}
        aria-label={`Decrease quantity of ${label}`}
        className="flex h-11 w-9 items-center justify-center border border-r-0 border-gray-300 text-lg text-gray-800 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-transparent"
      >
        <span aria-hidden="true">−</span>
      </button>
      <label htmlFor={id} className="sr-only">
        Quantity of {label}
      </label>
      <input
        id={id}
        onChange={(e) => {
          setValue(e.target.value);
          if (e.target.value === "" || e.target.value === "0") return;
          const next = Number(e.target.value);
          if (Number.isFinite(next) && next >= MIN_QTY && next <= MAX_QTY)
            onChange(next);
        }}
        onBlur={() => {
          if (value === "" || Number(value) < MIN_QTY)
            setValue(String(quantity));
        }}
        type="number"
        inputMode="numeric"
        min={MIN_QTY}
        max={MAX_QTY}
        value={value}
        className="h-11 w-12 border border-gray-300 px-1 text-center text-base sm:w-14"
      />
      <button
        type="button"
        onClick={() => commit(quantity + 1)}
        disabled={quantity >= MAX_QTY}
        aria-label={`Increase quantity of ${label}`}
        className="flex h-11 w-9 items-center justify-center border border-l-0 border-gray-300 text-lg text-gray-800 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
};

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    UpdateQuantity,
    navigate,
    isLoadingProducts,
  } = useContext(ShopContext);
  // Derived from the cart during render (no empty first frame)
  const cartData = useMemo(() => {
    if (products.length === 0) return [];
    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item],
          });
        }
      }
    }
    return tempData;
  }, [cartItems, products]);

  const rows = cartData
    .map((item) => ({
      ...item,
      productData: products.find((product) => product._id === item._id),
    }))
    // Skip items whose product no longer exists instead of crashing
    .filter((item) => item.productData);

  return (
    <div className="pt-8 sm:pt-14">
      <div className="mb-3 text-xl sm:text-2xl">
        <Title as="h1" text1={"YOUR"} text2={"CART"} />
      </div>
      {isLoadingProducts && rows.length === 0 ? (
        <p className="py-16 text-center text-gray-600" role="status">
          Loading your cart…
        </p>
      ) : rows.length === 0 ? (
        <div className="flex animate-fade-in flex-col items-center gap-4 border border-dashed border-gray-300 px-6 py-16 text-center">
          <p className="text-base text-gray-700">Your cart is empty.</p>
          <Link to="/collection" className="btn-primary">
            Continue shopping
          </Link>
        </div>
      ) : (
        <ul role="list" aria-label="Cart items">
          {rows.map(({ productData, ...item }, index) => {
            const label = `${productData.name}, size ${item.size}`;
            return (
              <li
                key={item._id + item.size}
                className="grid animate-fade-in-up grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 border-t py-4 text-gray-700 last:border-b sm:grid-cols-[4fr_2fr_auto]"
              >
                <div className="col-span-2 flex items-start gap-4 sm:col-span-1 sm:gap-5">
                  <img
                    src={productData.image[0]}
                    alt=""
                    className="w-20 shrink-0 sm:w-20"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium sm:text-lg">
                      <Link
                        className="text-gray-800 underline-offset-2 hover:underline"
                        to={`/product/${productData._id}`}
                      >
                        {productData.name}
                      </Link>
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-sm sm:text-base">
                      <p>
                        <span className="sr-only">Price: </span>
                        {currency}
                        {productData.price}
                      </p>
                      <p className="border border-gray-200 bg-slate-50 px-2 py-0.5 sm:px-3 sm:py-1">
                        <span className="sr-only">Size: </span>
                        {item.size}
                      </p>
                    </div>
                  </div>
                </div>
                <QuantityControl
                  id={`qty-${index}`}
                  quantity={item.quantity}
                  label={label}
                  onChange={(next) => UpdateQuantity(item._id, item.size, next)}
                />
                <button
                  type="button"
                  onClick={() => UpdateQuantity(item._id, item.size, 0)}
                  className="icon-btn justify-self-end"
                  aria-label={`Remove ${label} from cart`}
                >
                  <img className="w-4 sm:w-5" src={assets.bin_icon} alt="" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <div className="my-12 flex justify-end sm:my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              type="button"
              onClick={() => {
                let navPath = "/place-order";
                if (cartData.length <= 0) {
                  navPath = "/cart";
                  toast.error("Add an item to the cart to proceed.");
                }
                navigate(navPath);
              }}
              className="btn-primary my-8 w-full sm:w-auto"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

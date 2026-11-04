import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
  const cartAmount = getCartAmount();
  const isEmpty = cartAmount === 0 || cartAmount === undefined;
  const format = (value) => `${currency} ${Number(value || 0).toFixed(2)}`;

  return (
    <section className="w-full" aria-labelledby="cart-totals-heading">
      <div className="text-xl sm:text-2xl">
        <Title id="cart-totals-heading" text1={"CART"} text2={"TOTALS"} />
      </div>
      <dl className="mt-2 flex flex-col text-sm [&>div+div]:border-t [&>div+div]:border-gray-200">
        <div className="flex justify-between py-2">
          <dt>Subtotal</dt>
          <dd>{format(cartAmount)}</dd>
        </div>
        <div className="flex justify-between py-2">
          <dt>Shipping fee</dt>
          <dd>{format(isEmpty ? 0 : delivery_fee)}</dd>
        </div>
        <div className="flex justify-between py-2 text-base font-bold text-gray-900">
          <dt>Total</dt>
          <dd>{format(isEmpty ? 0 : cartAmount + delivery_fee)}</dd>
        </div>
      </dl>
    </section>
  );
};

export default CartTotal;

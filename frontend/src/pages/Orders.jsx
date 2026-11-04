import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { toast } from "react-toastify";
import axios from "axios";

const statusDotClass = (statusState) =>
  statusState === "info"
    ? "bg-blue-500"
    : statusState === "error"
      ? "bg-red-600"
      : "bg-green-600";

const OrderRow = ({
  image,
  name,
  price,
  quantity,
  size,
  date,
  payment,
  status,
  statusState,
  currency,
  onTrack,
  isLoading,
}) => (
  <li className="flex animate-fade-in-up flex-col gap-4 border-t py-4 text-gray-700 last:border-b md:flex-row md:items-center md:justify-between">
    <div className="flex items-start gap-4 text-sm sm:gap-6">
      <img src={image} alt="" className="w-16 shrink-0 sm:w-20" />
      <div className="min-w-0">
        <p className="font-medium text-gray-900 sm:text-base">{name}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-700 sm:text-base">
          <p>
            <span className="sr-only">Price: </span>
            {currency}
            {price}
          </p>
          <p>Quantity: {quantity}</p>
          <p>Size: {size}</p>
        </div>
        <p className="mt-1">
          Date: <span className="text-gray-600">{date}</span>
        </p>
        {payment && (
          <p className="mt-1">
            Payment: <span className="text-gray-600">{payment}</span>
          </p>
        )}
      </div>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 md:w-1/2">
      <p className="flex items-center gap-2 text-sm md:text-base">
        <span
          aria-hidden="true"
          className={`h-2.5 w-2.5 min-w-2.5 rounded-full ${statusDotClass(statusState)}`}
        ></span>
        <span>
          <span className="sr-only">Status: </span>
          {status}
        </span>
      </p>
      <button
        type="button"
        onClick={onTrack}
        disabled={isLoading}
        className="min-h-11 shrink-0 rounded-sm border border-gray-500 px-4 py-2 text-sm font-medium transition duration-200 hover:border-black hover:bg-gray-50 active:scale-[0.98] disabled:opacity-60"
      >
        Track Order
      </button>
    </div>
  </li>
);

const Orders = () => {
  const { BACKEND_URL, token, currency, products } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(token));
  const loadOrderData = async () => {
    try {
      if (!token) return null;
      const response = await axios.post(
        BACKEND_URL + "/api/order/userorders",
        {},
        { headers: { token } },
      );

      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item["status"] = order.status;
            item["statusState"] = order.statusState;
            item["payment"] = order.payment;
            item["paymentMethod"] = order.paymentMethod;
            item["date"] = order.date;
            allOrdersItem.push(item);
          });
        });

        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadOrderData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <div className="pt-8 sm:pt-16">
      <div className="text-xl sm:text-2xl">
        <Title as="h1" text1={"MY"} text2={"ORDERS"} />
      </div>
      <p className="sr-only" role="status">
        {isLoading ? "Updating orders…" : ""}
      </p>
      <ul role="list" aria-label="Order items">
        {products.slice(1, 4).map((item, index) => (
          <OrderRow
            key={`sample-${index}`}
            image={item.image[0]}
            name={item.name}
            price={item.price}
            quantity={1}
            size="M"
            date="25, Jul, 2024"
            status="Ready to ship"
            statusState="success"
            currency={currency}
          />
        ))}
        {orderData.map((item, index) => (
          <OrderRow
            key={index}
            image={item.image[0]}
            name={item.name}
            price={item.price}
            quantity={item.quanitity}
            size={item.size}
            date={new Date(item.date).toDateString()}
            payment={item.paymentMethod}
            status={item.status}
            statusState={item.statusState}
            currency={currency}
            onTrack={() => {
              setIsLoading(true);
              loadOrderData();
            }}
            isLoading={isLoading}
          />
        ))}
      </ul>
    </div>
  );
};

export default Orders;

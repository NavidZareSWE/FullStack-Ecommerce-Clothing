import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { backendURL, currency } from "../config";
import { assets } from "../assets/assets";
const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchAllOrders = async () => {
    if (!token) return null;
    try {
      const response = await axios.post(
        backendURL + "/api/order/list",
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const statusHandler = async (e, orderId) => {
    try {
      const statusState =
        e.target.value === "Cancel"
          ? "error"
          : e.target.value === "Delivered"
            ? "success"
            : "info";
      const status =
        e.target.value === "Cancel"
          ? "Order has been cancelled, contact us for more details."
          : e.target.value;
      const response = await axios.post(
        backendURL + "/api/order/status",
        {
          orderId,
          status,
          statusState,
        },
        { headers: { token } },
      );
      if (response.data.success) {
        await fetchAllOrders();
        toast.success(response.data.message);
      } else toast.error(response.data.message);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchAllOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <section aria-labelledby="orders-heading">
      <h1
        id="orders-heading"
        className="mb-3 text-xl font-semibold text-gray-900"
      >
        Order Page
      </h1>
      <p className="mb-3 text-sm text-gray-600" role="status">
        {isLoading
          ? "Loading orders…"
          : `${orders.length} ${orders.length === 1 ? "order" : "orders"}`}
      </p>
      <ul role="list" aria-labelledby="orders-heading">
        {orders.map((order, index) => {
          const selectId = `order-status-${order._id || index}`;
          const customer =
            order.address.firstName && order.address.lastName
              ? `${order.address.firstName} ${order.address.lastName}`
              : order.address;
          return (
            <li
              className="my-3 grid animate-fade-in-up grid-cols-1 items-start gap-3 rounded border-2 border-gray-200 bg-white p-4 text-sm text-gray-700 sm:grid-cols-[0.5fr_2fr_1fr] sm:p-5 md:my-4 md:p-8 lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr]"
              key={order._id || index}
            >
              <img className="w-12" src={assets.parcel_icon} alt="" />
              <div>
                <ul className="list-none">
                  {order.items.map((item, index) => (
                    <li className="py-0.5" key={index}>
                      {item.name} x {item.quanitity} <span> {item.size} </span>
                      {index !== order.items.length - 1 && ","}
                    </li>
                  ))}
                </ul>
                <p className="mb-2 mt-3 font-medium text-gray-900">
                  {typeof customer === "string" ? customer : ""}
                </p>
                <address className="not-italic">
                  <p>{`${order.address.street},`}</p>
                  <p>{`${order.address.city}, ${order.address.state}, ${order.address.country}, ${order.address.zipcode}`}</p>
                  <p>{order.address.phone}</p>
                </address>
              </div>
              <div>
                <p className="text-sm sm:text-[15px]">
                  Items: {order.items.length}
                </p>
                <p className="mt-3">Method: {order.paymentMethod}</p>
                <p>Payment: {order.payment ? "Done" : "Pending"}</p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className="text-base font-medium text-gray-900 sm:text-[15px]">
                <span className="sr-only">Amount: </span>
                {currency}
                {order.amount}{" "}
              </p>
              <div>
                <label htmlFor={selectId} className="sr-only">
                  Order status
                </label>
                <select
                  id={selectId}
                  onChange={(event) => statusHandler(event, order._id)}
                  value={
                    order.statusState === "error" ? "Cancel" : order.status
                  }
                  className="w-full p-2 font-semibold"
                >
                  <option value="OrderPlaced">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancel">Cancel</option>
                </select>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Orders;

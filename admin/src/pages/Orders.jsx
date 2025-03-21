import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { backendURL, currency } from "../App";
import { assets } from "../assets/assets";
const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
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
  }, [token]);
  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {orders.map((order, index) => {
          console.log(order);
          return (
            <div
              className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
              key={index}
            >
              <img
                className="w-12"
                src={assets.parcel_icon}
                alt="Parcel icon"
              />
              <div>
                <div>
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return (
                        <p className="py-0.5" key={index}>
                          {item.name} x {item.quanitity}{" "}
                          <span> {item.size} </span>
                        </p>
                      );
                    } else {
                      return (
                        <p className="py-0.5" key={index}>
                          {item.name} x {item.quanitity}{" "}
                          <span> {item.size} </span> ,{" "}
                        </p>
                      );
                    }
                  })}
                </div>
                <p className="mt-3 mb-2 font-medium">
                  {order.address.firstName && order.address.lastName
                    ? `${order.address.firstName} ${order.address.lastName}`
                    : order.address}
                </p>
                <div>
                  <p>{`${order.address.street},`}</p>
                  <p>{`${order.address.city}, ${order.address.state}, ${order.address.country}, ${order.address.zipcode}`}</p>
                </div>
                <p>{order.address.phone}</p>
              </div>
              <div>
                <p className="text-sm sm:text-[15px]">
                  Items: {order.items.length}
                </p>
                <p className="mt-3">Method: {order.paymentMethod}</p>
                <p>Payment: {order.payment ? "Done" : "Pending"}</p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className="text-sm sm:text-[15px]">
                {currency}
                {order.amount}{" "}
              </p>
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={
                  order.statusState === "error"
                    ? "Cancel"
                    : order.statusState === "info"
                      ? order.status
                      : order.status
                }
                className="p-2 font-semibold"
              >
                <option value="OrderPlaced">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancel">Cancel</option>
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;

import axios from "axios";
import { useEffect, useState } from "react";
import { backendURL, currency } from "../config";
import { toast } from "react-toastify";
const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendURL + "/api/product/list");
      if (response.data.success) setList(response.data.products);
      else toast.error(response.data.message);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const removeProduct = async (id, name) => {
    // Destructive action: ask for confirmation first
    if (!window.confirm(`Remove "${name}" from the store?`)) return;
    try {
      const response = await axios.post(
        backendURL + "/api/product/remove",
        { id },
        { headers: { token } },
      );
      if (response.data.success) {
        toast.info(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section aria-labelledby="list-heading">
      <h1
        id="list-heading"
        className="mb-3 text-xl font-semibold text-gray-900"
      >
        All Products List
      </h1>
      <p className="mb-3 text-sm text-gray-600" role="status">
        {isLoading
          ? "Loading products…"
          : `${list.length} ${list.length === 1 ? "product" : "products"}`}
      </p>
      {/* ---------------- List Table Title (visual only) ------------------------ */}
      <div
        aria-hidden="true"
        className="hidden grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center border bg-gray-100 px-2 py-2 text-sm md:grid"
      >
        <b>Image</b>
        <b>Name</b>
        <b>Category</b>
        <b>Price</b>
        <b className="text-center">Action</b>
      </div>
      {/* ---------------- Product List ------------------------ */}
      <ul
        role="list"
        aria-labelledby="list-heading"
        className="flex flex-col gap-2 md:mt-2"
      >
        {list.map((item, index) => {
          return (
            <li
              className="grid animate-fade-in-up grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-x-3 border bg-white px-2 py-2 text-sm md:grid-cols-[1fr_3fr_1fr_1fr_1fr] md:gap-2"
              key={item._id || index}
            >
              <img
                className="row-span-2 w-[48px] md:row-span-1"
                src={item.image[0]}
                alt=""
                loading="lazy"
              />
              <p className="font-medium text-gray-900 [overflow-wrap:anywhere] md:font-normal md:text-gray-700">
                {item.name}
              </p>
              <p className="col-start-2 row-start-2 text-gray-600 md:col-start-auto md:row-start-auto md:text-gray-700">
                <span className="sr-only">Category: </span>
                {item.category}
                <span className="md:hidden">
                  {" "}
                  · {currency}
                  {item.price}
                </span>
              </p>
              <p className="hidden md:block">
                <span className="sr-only">Price: </span>
                {currency}
                {item.price}
              </p>
              <div className="col-start-3 row-span-2 row-start-1 text-right md:col-start-auto md:row-span-1 md:row-start-auto md:text-center">
                <button
                  type="button"
                  onClick={() => removeProduct(item._id, item.name)}
                  className="inline-flex h-[44px] w-[44px] items-center justify-center rounded-full text-lg text-gray-700 transition duration-200 hover:bg-red-50 hover:text-red-700 active:scale-95"
                  aria-label={`Remove ${item.name}`}
                >
                  <span aria-hidden="true">✕</span>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default List;

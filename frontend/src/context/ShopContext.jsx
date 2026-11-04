import { createContext, useEffect, useState } from "react";
import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TOKEN_STORAGE_KEY } from "../constants/storage";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "£";
  const delivery_fee = 10;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState(``);
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [productsDB, setProductsDB] = useState([]);
  // Read the saved login on first render (avoids a "logged out" flash)
  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_STORAGE_KEY) || "",
  );
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const navigate = useNavigate();

  const addToCart = async (itemid, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }
    let cartData = structuredClone(cartItems);
    if (cartData[itemid]) {
      if (cartData[itemid][size]) {
        cartData[itemid][size] += 1;
      } else {
        cartData[itemid][size] = 1;
      }
    } else {
      cartData[itemid] = {};
      cartData[itemid][size] = 1;
    }
    setCartItems(cartData);

    if (token) {
      try {
        const response = await axios.post(
          BACKEND_URL + "/api/cart/add",
          { itemid, size },
          {
            headers: { token },
          },
        );
        if (response.data.success) toast.success(response.data.message);
        else toast.error(response.data.message);
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
  };
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const size in cartItems[items]) {
        try {
          if (cartItems[items][size] > 0) {
            totalCount += cartItems[items][size];
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
    return totalCount;
  };
  const UpdateQuantity = async (itemid, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemid][size] = quantity;
    setCartItems(cartData);
    if (token) {
      try {
        const response = await axios.post(
          BACKEND_URL + "/api/cart/update",
          { itemid, size, quantity },
          {
            headers: { token },
          },
        );
        if (response.data.success) toast.success(response.data.message);
        else toast.error(response.data.message);
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
  };
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = productsDB.find((product) => product._id === items);
      // Products may still be loading (or the item was removed): skip it
      if (!itemInfo) continue;
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
    return totalAmount;
  };

  const sortSizes = (sizes) => {
    const sortOrder = ["S", "M", "L", "XL", "XXL"];
    return sortOrder.filter((size) => sizes.includes(size));
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(BACKEND_URL + "/api/product/list");
      if (response.data.success) {
        const DBProducts = response.data.products;
        products.forEach((item) => {
          item.sizes = sortSizes(item.sizes);
        });
        DBProducts.forEach((item) => {
          item.sizes = sortSizes(item.sizes);
        });
        setProductsDB([...products, ...DBProducts]);
      } else toast.error(response.data.message);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoadingProducts(false);
    }
  };
  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        BACKEND_URL + "/api/cart/get",
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      } else toast.error(response.data.message);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    getProductsData();
  }, []);
  useEffect(() => {
    // Restore the logged-in user's cart on page load
    if (token) getUserCart(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    products: productsDB,
    isLoadingProducts,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    UpdateQuantity,
    getCartAmount,
    navigate,
    BACKEND_URL,
    token,
    setToken,
  };
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;

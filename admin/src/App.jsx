import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import { useEffect, useRef, useState } from "react";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const titles = {
  "/add": "Add items",
  "/list": "List items",
  "/orders": "Orders",
};

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : "",
  );
  const location = useLocation();
  const mainRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Page title + move focus to the new page content on navigation
  useEffect(() => {
    const title = token ? titles[location.pathname] : "Sign in";
    document.title = title
      ? `${title} | Forever Admin Panel`
      : "Forever Admin Panel";
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
  }, [location.pathname, token]);

  return (
    <div className="min-h-screen bg-gray-50">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-black focus:px-4 focus:py-3 focus:text-sm focus:text-white"
      >
        Skip to main content
      </a>
      <ToastContainer newestOnTop limit={3} autoClose={4000} />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />

          <div className="flex w-full flex-col md:flex-row">
            <Sidebar />
            <main
              id="admin-main"
              ref={mainRef}
              tabIndex={-1}
              className="mx-auto my-6 w-full min-w-0 max-w-6xl px-4 text-base text-gray-700 focus:outline-none sm:px-6 md:my-8 md:px-8"
            >
              {/* Each page fades in gently on navigation */}
              <div key={location.pathname} className="animate-fade-in">
                <Routes>
                  <Route path="/" element={<Navigate to="/add" replace />} />
                  <Route path="/add" element={<Add token={token} />} />
                  <Route path="/list" element={<List token={token} />} />
                  <Route path="/orders" element={<Orders token={token} />} />
                </Routes>
              </div>
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default App;

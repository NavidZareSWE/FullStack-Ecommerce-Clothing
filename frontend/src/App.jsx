import { useEffect, useRef } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrders from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import NoPage from "./pages/NoPage";
import Footer from "./components/Footer";
import BacktoTopButton from "./components/BacktoTopButton";
import SearchBar from "./components/SearchBar";
import useRevealOnScroll from "./hooks/useRevealOnScroll";
import useHideOnScroll from "./hooks/useHideOnScroll";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SITE_NAME = "Forever";

const pages = {
  home: { path: "/", element: <Home />, title: "Home" },
  collection: {
    path: "/collection",
    element: <Collection />,
    title: "Collection",
  },
  about: { path: "/about", element: <About />, title: "About us" },
  contact: { path: "/contact", element: <Contact />, title: "Contact us" },
  product: {
    path: "/product/:productId",
    element: <Product />,
    title: "Product",
  },
  cart: { path: "/cart", element: <Cart />, title: "Your cart" },
  login: { path: "/login", element: <Login />, title: "Sign in" },
  placeOrders: {
    path: "/place-order",
    element: <PlaceOrders />,
    title: "Checkout",
  },
  orders: { path: "/orders", element: <Orders />, title: "My orders" },
};

const getPageTitle = (pathname) => {
  if (pathname === "/404") return "Page not found";
  if (pathname.startsWith("/product/")) return pages.product.title;
  const page = Object.values(pages).find((p) => p.path === pathname);
  return page ? page.title : null;
};

const App = () => {
  const location = useLocation();
  const mainRef = useRef(null);
  const headerRef = useRef(null);
  const headerHidden = useHideOnScroll(headerRef);
  useRevealOnScroll();
  const isFirstRender = useRef(true);
  // Global UI (header, search, footer) is hidden on the 404 page
  const showGlobalComponent = location.pathname !== "/404";

  // Route change: update the document title, scroll to the top and move
  // focus to the main content so screen reader and keyboard users start
  // reading the new page from the beginning (WCAG 2.4.2 / 2.4.3).
  useEffect(() => {
    const title = getPageTitle(location.pathname);
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    // Don't steal focus from the search field when search opens a new page
    if (!document.activeElement?.closest('[role="search"]')) {
      mainRef.current?.focus({ preventScroll: true });
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Skip link: first focusable element on every page (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-black focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to main content
      </a>

      {/* react-toastify (announces messages to assistive technology) */}
      <ToastContainer
        position="top-right"
        newestOnTop
        limit={3}
        autoClose={4000}
        pauseOnFocusLoss
        closeOnClick={false}
      />

      {/* Unchangeable UI's defined here: */}
      {showGlobalComponent && (
        <header
          ref={headerRef}
          className={`sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur transition-transform duration-300 ease-out supports-[backdrop-filter]:bg-white/85 ${
            headerHidden ? "-translate-y-full" : "translate-y-0"
          }`}
        >
          <div className="page-container">
            <NavBar />
          </div>
        </header>
      )}
      {showGlobalComponent && <SearchBar />}

      <main
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        className="page-container flex-1 focus:outline-none"
      >
        {/* Keyed by path so each page fades in gently on navigation */}
        <div key={location.pathname} className="animate-fade-in">
          <Routes>
            {Object.entries(pages).map(([key, { path, element }]) => (
              <Route key={key} path={path} element={element} />
            ))}
            <Route path="/home" element={<Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/404" />} />
            <Route path="/404" element={<NoPage />} />
          </Routes>
        </div>
      </main>

      {showGlobalComponent && <BacktoTopButton />}
      {showGlobalComponent && <Footer />}
    </div>
  );
};

export default App;

import { assets } from "../assets/assets";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ShopContext } from "../context/ShopContext";
import { TOKEN_STORAGE_KEY } from "../constants/storage";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/collection", label: "Collection" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);
  const location = useLocation();
  const cartCount = getCartCount();

  const menuButtonRef = useRef(null);
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const profileRef = useRef(null);
  const profileButtonRef = useRef(null);
  const wasDrawerOpen = useRef(false);

  // Small "bump" on the cart badge whenever the item count goes up
  const [prevCount, setPrevCount] = useState(cartCount);
  const [bumpKey, setBumpKey] = useState(0);
  if (prevCount !== cartCount) {
    if (cartCount > prevCount) setBumpKey((k) => k + 1);
    setPrevCount(cartCount);
  }

  const logout = () => {
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    navigate("/login");
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken("");
    setCartItems({});
  };

  const openSearch = () => {
    setShowSearch(true);
    if (!location.pathname.includes("collection")) navigate("/collection");
  };

  const closeDrawer = useCallback(() => setIsMenuOpen(false), []);

  // Close menus whenever the route changes (adjusting state during render
  // avoids an extra effect pass)
  const [lastPath, setLastPath] = useState(location.pathname);
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }

  // Mobile drawer: lock page scroll, move focus into the dialog, trap Tab
  // and close on Escape. Focus returns to the menu button when it closes.
  useEffect(() => {
    if (!isMenuOpen) {
      if (wasDrawerOpen.current) {
        wasDrawerOpen.current = false;
        menuButtonRef.current?.focus({ preventScroll: true });
      }
      return;
    }
    wasDrawerOpen.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeDrawer();
        return;
      }
      if (e.key !== "Tab" || !drawerRef.current) return;
      const focusable = drawerRef.current.querySelectorAll(FOCUSABLE);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen, closeDrawer]);

  // Close the drawer if the screen grows past the mobile breakpoint
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const onChange = (e) => e.matches && setIsMenuOpen(false);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // Profile menu: close on outside click or Escape
  useEffect(() => {
    if (!isProfileOpen) return;
    const onPointerDown = (e) => {
      if (!profileRef.current?.contains(e.target)) setIsProfileOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsProfileOpen(false);
        profileButtonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isProfileOpen]);

  // Keep the original "open on hover" behaviour for mouse users
  const canHover = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;

  const isLoggedIn = Boolean(token);

  return (
    <nav
      aria-label="Main"
      className="flex min-w-0 items-center justify-between gap-[8px] py-2 font-medium sm:gap-[12px]"
    >
      <Link
        to="/"
        className="shrink-0 rounded transition-opacity hover:opacity-80"
        aria-label="Forever – home"
      >
        <img
          src={assets.logo}
          alt=""
          width="787"
          height="774"
          className="h-auto w-[64px] xs:w-[80px] md:w-[96px]"
        />
      </Link>

      {/* Desktop navigation */}
      <ul className="hidden min-w-0 flex-wrap justify-center text-sm text-gray-700 sm:flex md:gap-2 lg:gap-4">
        {navLinks.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/"}
              className="group flex flex-col items-center gap-1 rounded px-1.5 py-2 uppercase transition-colors hover:text-black md:px-2 md:tracking-wide [&.active]:text-black"
            >
              <span>{label}</span>
              {/* Underline grows in on hover and stays for the active page */}
              <span
                aria-hidden="true"
                className="h-[1.5px] w-2/4 origin-center scale-x-0 bg-gray-800 transition-transform duration-300 group-hover:scale-x-100 group-[.active]:scale-x-100"
              />
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className="flex shrink-0 items-center xs:gap-[2px] sm:gap-[4px] md:gap-[8px]">
        <button
          type="button"
          onClick={openSearch}
          className="icon-btn"
          aria-label="Search products"
        >
          <img src={assets.search_icon} alt="" className="w-[20px]" />
        </button>

        {isLoggedIn ? (
          <div
            ref={profileRef}
            className="relative"
            onMouseEnter={() => canHover() && setIsProfileOpen(true)}
            onMouseLeave={() => canHover() && setIsProfileOpen(false)}
          >
            <button
              ref={profileButtonRef}
              type="button"
              className="icon-btn"
              aria-label="Account menu"
              aria-haspopup="true"
              aria-expanded={isProfileOpen}
              aria-controls="profile-menu"
              onClick={() => setIsProfileOpen((prev) => !prev)}
            >
              <img src={assets.profile_icon} alt="" className="w-[20px]" />
            </button>
            {/* Dropdown Menu */}
            <div
              id="profile-menu"
              className={`absolute right-0 z-50 pt-2 ${isProfileOpen ? "block animate-pop-in" : "hidden"} origin-top-right`}
            >
              <ul className="flex w-44 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white py-2 text-sm text-gray-700 shadow-lg">
                <li>
                  <span
                    aria-disabled="true"
                    className="flex min-h-11 cursor-not-allowed items-center justify-between px-4 text-gray-500"
                  >
                    My Profile
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
                      Soon
                    </span>
                  </span>
                </li>
                <li>
                  <Link
                    to="/orders"
                    className="flex min-h-11 items-center px-4 transition-colors hover:bg-gray-100 hover:text-black"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex min-h-11 w-full items-center px-4 text-left transition-colors hover:bg-gray-100 hover:text-black"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <Link to="/login" className="icon-btn" aria-label="Sign in">
            <img src={assets.profile_icon} alt="" className="w-[20px]" />
          </Link>
        )}

        <Link
          to="/cart"
          className="icon-btn"
          aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
        >
          <img
            src={assets.cart_icon}
            alt=""
            className="w-[20px] min-w-[20px]"
          />
          <span
            key={bumpKey}
            aria-hidden="true"
            className={`absolute bottom-0.5 right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold leading-none text-white xs:bottom-1 xs:right-1 ${bumpKey ? "animate-bump" : ""}`}
          >
            {cartCount}
          </span>
        </Link>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setIsMenuOpen(true)}
          className="icon-btn sm:hidden"
          aria-label="Open menu"
          aria-haspopup="dialog"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <img src={assets.menu_icon} alt="" className="w-[20px]" />
        </button>
      </div>

      {/* Sidebar Menu for small Screens. Rendered in a portal (so the sticky
          header can't become its containing block) inside a full-screen frame
          that clips the sliding panel: nothing ever sits beyond the screen
          edge, which would otherwise widen the page on mobile browsers. */}
      {createPortal(
        <div
          className={`fixed inset-0 z-50 overflow-hidden transition-[visibility] duration-300 sm:hidden ${
            isMenuOpen ? "visible" : "pointer-events-none invisible"
          }`}
        >
          <div
            className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
              isMenuOpen ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden="true"
            onClick={closeDrawer}
          />
          <div
            ref={drawerRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className={`absolute inset-y-0 right-0 flex w-[85%] max-w-xs flex-col bg-white pb-[env(safe-area-inset-bottom)] shadow-xl transition-transform duration-300 ease-out ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <span className="text-base font-semibold text-gray-900">
                Menu
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeDrawer}
                className="icon-btn"
                aria-label="Close menu"
              >
                <img src={assets.cross_icon} alt="" className="w-3.5" />
              </button>
            </div>
            <ul className="flex flex-col overflow-y-auto py-2 text-gray-700">
              {navLinks.map(({ to, label }, index) => (
                <li
                  key={to}
                  className={isMenuOpen ? "animate-fade-in-up" : "opacity-0"}
                  style={{ animationDelay: `${80 + index * 50}ms` }}
                >
                  <NavLink
                    onClick={closeDrawer}
                    end={to === "/"}
                    to={to}
                    className={({ isActive }) =>
                      `flex min-h-12 items-center px-6 text-base uppercase tracking-wide transition-colors ${
                        isActive
                          ? "bg-black text-white"
                          : "hover:bg-gray-100 hover:text-black"
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mt-auto border-t border-gray-200 py-2 text-gray-700">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/orders"
                    onClick={closeDrawer}
                    className="flex min-h-12 items-center px-6 transition-colors hover:bg-gray-100"
                  >
                    My orders
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="flex min-h-12 w-full items-center px-6 text-left transition-colors hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={closeDrawer}
                  className="flex min-h-12 items-center px-6 transition-colors hover:bg-gray-100"
                >
                  Sign in / Create account
                </Link>
              )}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </nav>
  );
};

export default NavBar;

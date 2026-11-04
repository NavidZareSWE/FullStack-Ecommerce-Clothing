import { useContext, useEffect, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(ShopContext);
  const location = useLocation();
  const inputRef = useRef(null);

  // Only shown on the collection page, once the user opened it
  const isOpen = showSearch && location.pathname.includes("collection");

  // Move keyboard focus into the field as soon as the search opens
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="animate-slide-down border-b border-gray-200 bg-gray-50">
      <form
        role="search"
        aria-label="Products"
        onSubmit={(e) => e.preventDefault()}
        className="page-container flex items-center gap-2 py-4 sm:justify-center"
      >
        <div className="flex min-h-11 flex-1 items-center gap-2 rounded-full border border-gray-500 bg-white px-4 focus-within:border-black focus-within:ring-2 focus-within:ring-black/20 sm:max-w-xl">
          <img src={assets.search_icon} alt="" className="w-4 shrink-0" />
          <label htmlFor="site-search" className="sr-only">
            Search products by name
          </label>
          <input
            id="site-search"
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setShowSearch(false);
            }}
            className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none placeholder:text-gray-500 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            type="search"
            placeholder="Search products"
            autoComplete="off"
            enterKeyHint="search"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                inputRef.current?.focus();
              }}
              className="shrink-0 rounded px-1 text-sm text-gray-600 underline-offset-2 hover:text-black hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowSearch(false)}
          className="icon-btn"
          aria-label="Close search"
        >
          <img src={assets.cross_icon} alt="" className="w-3" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;

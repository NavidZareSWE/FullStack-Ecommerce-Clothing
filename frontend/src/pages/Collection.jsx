import { useContext, useMemo, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductGrid from "../components/ProductGrid";
import style from "./Collection.module.css";

const CATEGORIES = ["Men", "Women", "Kids"];
const SUB_CATEGORIES = ["Topwear", "Bottomwear", "Winterwear"];

const FilterGroup = ({ legend, options, selected, onChange }) => (
  <fieldset className="border border-gray-300 bg-gray-50 px-5 py-3">
    <legend className="float-left mb-2 w-full text-sm font-medium text-gray-900">
      {legend}
    </legend>
    <div className="clear-left flex flex-col text-sm text-gray-700">
      {options.map((option) => (
        <label
          key={option}
          className="flex min-h-10 cursor-pointer items-center gap-3 transition-colors hover:text-black"
        >
          <span className={`${style.checkbox} ${style.bounce}`}>
            <input
              type="checkbox"
              value={option}
              checked={selected.includes(option)}
              onChange={onChange}
            />
            <svg viewBox="0 0 21 21" aria-hidden="true">
              <polyline points="5 10.75 8.5 14.25 16 6"></polyline>
            </svg>
          </span>
          {option}
        </label>
      ))}
    </div>
  </fieldset>
);

const Collection = () => {
  const { products, search, showSearch, isLoadingProducts } =
    useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");

  const toggleFilterValue = (selected, setSelected) => (e) => {
    const value = e.target.value;
    if (selected.includes(value))
      setSelected((prev) => prev.filter((item) => item !== value));
    else setSelected((prev) => [...prev, value]);
  };
  const toggleCategory = toggleFilterValue(category, setCategory);
  const toggleSubCategory = toggleFilterValue(subCategory, setSubCategory);

  const clearFilters = () => {
    setCategory([]);
    setSubCategory([]);
  };

  // Filter + sort are derived from state during render (no extra effect
  // pass, so there is never a frame showing stale or empty results).
  const filterProducts = useMemo(() => {
    let productsCopy = structuredClone(products);
    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category),
      );
    }
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory),
      );
    }
    switch (sortType) {
      case "Low-High":
        return productsCopy.sort((a, b) => a.price - b.price);
      case "High-Low":
        return productsCopy.sort((a, b) => a.price - b.price).reverse();
      default:
        return productsCopy;
    }
  }, [category, subCategory, products, showSearch, search, sortType]);

  const activeFilterCount = category.length + subCategory.length;

  return (
    <div className="flex flex-col gap-1 pt-6 sm:flex-row sm:gap-10 sm:pt-10">
      {/* Left Side */}
      {/* Filter Options */}
      <aside className="sm:w-56 sm:min-w-56" aria-labelledby="filters-heading">
        <h2
          id="filters-heading"
          className="sr-only sm:not-sr-only sm:my-2 sm:text-xl"
        >
          FILTERS
        </h2>
        {/* Mobile: collapsible filters (same look as the desktop heading) */}
        <button
          type="button"
          onClick={() => setShowFilter(!showFilter)}
          aria-expanded={showFilter}
          aria-controls="filter-panel"
          className="flex min-h-11 items-center gap-2 text-xl sm:hidden"
        >
          FILTERS
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-black px-2 py-0.5 text-xs text-white">
              {activeFilterCount}
              <span className="sr-only"> active</span>
            </span>
          )}
          <img
            className={`h-3 transition-transform duration-300 ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </button>
        {/* Animated open/close on mobile; always open from the sm breakpoint */}
        <div
          id="filter-panel"
          className={`grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-out sm:grid-rows-[1fr] sm:opacity-100 ${
            showFilter
              ? "grid-rows-[1fr] opacity-100"
              : "invisible grid-rows-[0fr] opacity-0 sm:visible"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-4 pb-2 pt-3 sm:pt-6">
              {/* Category Filter */}
              <FilterGroup
                legend="CATEGORIES"
                options={CATEGORIES}
                selected={category}
                onChange={toggleCategory}
              />
              {/* SubCategory Filter */}
              <FilterGroup
                legend="TYPE"
                options={SUB_CATEGORIES}
                selected={subCategory}
                onChange={toggleSubCategory}
              />
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="min-h-11 self-start text-sm text-gray-700 underline underline-offset-4 transition-colors hover:text-black"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>
      {/* Right Side */}
      <section className="min-w-0 flex-1" aria-labelledby="collection-heading">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-base sm:text-2xl">
          <Title
            as="h1"
            id="collection-heading"
            text1={"ALL"}
            text2={"COLLECTIONS"}
          />
          {/* Product Sort */}
          <label htmlFor="sort-products" className="sr-only">
            Sort products
          </label>
          <select
            id="sort-products"
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="mb-3 min-h-10 max-w-full cursor-pointer border-2 border-gray-300 bg-white px-2 text-sm transition-colors hover:border-gray-500"
          >
            <option value="relavent">Sort by: Relevance</option>
            <option value="Low-High">Sort by: Low to High</option>
            <option value="High-Low">Sort by: High to Low</option>
          </select>
        </div>
        {/* Announce result changes to screen readers */}
        <p className="mb-4 text-sm text-gray-600" role="status">
          {isLoadingProducts && products.length === 0
            ? "Loading products…"
            : `${filterProducts.length} ${filterProducts.length === 1 ? "product" : "products"}`}
        </p>
        {/* Show All Products - Map Products */}
        {!isLoadingProducts && filterProducts.length === 0 ? (
          <div className="flex animate-fade-in flex-col items-center gap-4 border border-dashed border-gray-300 px-6 py-16 text-center">
            <p className="text-base text-gray-700">
              No products match your search or filters.
            </p>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="btn-secondary"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <ProductGrid
            products={filterProducts}
            className="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            skeletonCount={8}
            aria-labelledby="collection-heading"
          />
        )}
      </section>
    </div>
  );
};

export default Collection;

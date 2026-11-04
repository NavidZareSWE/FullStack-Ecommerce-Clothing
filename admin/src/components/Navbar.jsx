import { assets } from "../assets/assets";
const Navbar = ({ setToken }) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-2 sm:px-[4%]">
      <img
        src={assets.logo}
        alt="Forever admin panel"
        className="w-[64px] min-w-0 sm:w-[96px]"
      />
      <button
        type="button"
        className="min-h-[44px] shrink-0 rounded-full bg-gray-700 px-5 py-2 text-sm text-white transition duration-200 hover:bg-gray-900 active:scale-95 sm:px-7"
        onClick={() => setToken("")}
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;

import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const links = [
  { to: "/add", label: "Add items", icon: assets.add_icon },
  { to: "/list", label: "List items", icon: assets.order_icon },
  { to: "/orders", label: "Orders", icon: assets.order_icon },
];

const Sidebar = () => {
  return (
    <nav
      aria-label="Admin"
      className="border-b border-gray-200 bg-white md:min-h-[calc(100vh-4.5rem)] md:w-56 md:shrink-0 md:border-b-0 md:border-r-2 md:bg-transparent lg:w-64"
    >
      {/* Phones: three equal tabs that always fit; md+: vertical sidebar */}
      <ul className="grid grid-cols-3 gap-2 px-4 py-3 text-xs xs:text-sm md:flex md:flex-col md:gap-4 md:py-6 md:pl-[20%] md:pr-0 md:text-[15px]">
        {links.map(({ to, label, icon }) => (
          <li key={to} className="min-w-0">
            <NavLink
              className="flex min-h-11 flex-col items-center justify-center gap-1 rounded border border-gray-300 px-2 py-2 text-center transition-colors duration-200 hover:bg-pink-50 xs:flex-row xs:gap-2 md:justify-start md:gap-3 md:rounded-r-none md:border-r-0 md:px-3 md:text-left"
              to={to}
            >
              <img className="h-5 w-5" src={icon} alt="" />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;

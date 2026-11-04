import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import style from "./Footer.module.css";

// Opens in a new tab; tells assistive technology users about it (WCAG 3.2.5)
const ExternalLink = ({ href, children, className }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={className}
  >
    {children}
    <span className="sr-only"> (opens in a new tab)</span>
  </a>
);

const companyLinkClass =
  "inline-flex min-h-9 items-center underline-offset-4 hover:text-black hover:underline";

const contactLinkClass =
  "inline-flex min-h-11 max-w-full items-center gap-2 text-base text-gray-700 underline-offset-4 [overflow-wrap:anywhere] hover:text-black hover:underline";

const Footer = () => {
  return (
    <footer className={`${style.wrapper} mt-24 sm:mt-40`}>
      <div className="page-container">
        <div className="flex flex-col gap-10 py-10 text-sm sm:grid sm:grid-cols-[3fr_1fr_1fr] sm:gap-14">
          <div>
            <img
              src={assets.logo}
              alt="Forever"
              className="mb-5 w-28 sm:w-32"
              loading="lazy"
            />
            <p className="w-full leading-relaxed text-gray-700 md:w-2/3">
              Thank you for visiting our site! We&apos;re dedicated to providing
              you with the best in fashion and style. Stay connected by
              subscribing to our newsletter for exclusive updates, offers, and
              trends straight to your inbox. Your satisfaction is our priority,
              and we look forward to serving you. For any inquiries or support,
              feel free to contact us anytime. Happy shopping!
            </p>
          </div>
          <nav aria-labelledby="footer-company">
            <h2
              id="footer-company"
              className="mb-4 text-lg font-medium text-gray-900 sm:mb-5 sm:text-xl"
            >
              COMPANY
            </h2>
            <ul className="flex flex-col gap-1 text-gray-700">
              <li>
                <Link to="/" className={companyLinkClass}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className={companyLinkClass}>
                  About us
                </Link>
              </li>
              <li className="inline-flex min-h-9 items-center">Delivery</li>
              <li className="inline-flex min-h-9 items-center">
                Privacy Policy
              </li>
            </ul>
          </nav>
          <div>
            <h2 className="mb-4 text-lg font-medium text-gray-900 sm:mb-5 sm:text-xl">
              GET IN TOUCH
            </h2>
            <ul className="flex flex-col gap-1 text-gray-700">
              <li className="flex min-h-11 items-center gap-2 text-base">
                <img src="/telephone.svg" alt="" className="h-6 w-6" />
                <span>
                  <span className="sr-only">Phone: </span>+98-9xx xx xx xxx
                </span>
              </li>
              <li>
                <a
                  href="mailto:navidzareswe@gmail.com"
                  className={contactLinkClass}
                >
                  <img src="/envelope.svg" alt="" className="h-6 w-6" />
                  <span className="sr-only">Email: </span>
                  <span className="min-w-0 break-all">
                    NavidZareSWE@gmail.com
                  </span>
                </a>
              </li>
              <li>
                <ExternalLink
                  href="https://github.com/NavidZareSWE"
                  className={contactLinkClass}
                >
                  <img src="/github.svg" alt="" className="h-6 w-6" />
                  <span className="sr-only">GitHub: </span>
                  <span className="min-w-0">@NavidZareSWE</span>
                </ExternalLink>
              </li>
              <li>
                <ExternalLink
                  href="https://t.me/NavidZareSWE"
                  className={contactLinkClass}
                >
                  <img src="/telegram.svg" alt="" className="h-6 w-6" />
                  <span className="sr-only">Telegram: </span>
                  <span className="min-w-0">@NavidZareSWE</span>
                </ExternalLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="pb-6">
          <hr className={style.hr} />
          <p className="py-2 text-center text-sm text-gray-700">
            CopyRight© 2024@Ecommerce - All rights Reserved by{" "}
            <ExternalLink
              href={"https://github.com/NavidZareSWE"}
              className="font-semibold text-blue-950 underline-offset-4 hover:underline"
            >
              @NavidZareSWE
            </ExternalLink>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

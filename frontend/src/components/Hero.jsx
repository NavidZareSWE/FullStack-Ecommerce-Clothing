import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Pagination, Autoplay, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/a11y";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/keyboard";
import "./Hero.css";
import { prefersReducedMotion } from "../utils/motion";

const slides = [
  {
    eyebrow: "OUR BESTSELLERS",
    heading: "Latest Arrivals",
    image: assets.hero_img,
    imageFirst: false,
  },
  {
    eyebrow: "TOP PICKS FOR YOU",
    heading: "Just In",
    image: assets.hero_img_2,
    imageFirst: true,
  },
  {
    eyebrow: "FRESH FASHION FINDS",
    heading: "Hot Right Now",
    image: assets.hero_img_3,
    imageFirst: false,
  },
  {
    eyebrow: "EXCLUSIVE COLLECTIONS",
    heading: "Trending Now",
    image: assets.hero_img_4,
    imageFirst: true,
  },
];

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
    <path fill="currentColor" d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
  </svg>
);
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
    <path fill="currentColor" d="M8 5.14v13.72L19 12z" />
  </svg>
);

const Hero = () => {
  const [swiper, setSwiper] = useState(null);
  // Auto-rotation is off for users who ask for reduced motion
  const [isPlaying, setIsPlaying] = useState(() => !prefersReducedMotion());
  // Stable options object; playback is then controlled with start()/stop()
  const [autoplayOptions] = useState(() => ({
    enabled: !prefersReducedMotion(),
    // Slow enough to read each slide; pauses while hovered
    delay: 5000,
    pauseOnMouseEnter: true,
    disableOnInteraction: false,
  }));

  useEffect(() => {
    if (!swiper?.autoplay) return;
    if (isPlaying) swiper.autoplay.start();
    else swiper.autoplay.stop();
  }, [swiper, isPlaying]);

  return (
    <section
      aria-label="Featured collections"
      className="relative mt-4 sm:mt-6"
    >
      <Swiper
        className="hero-swiper border border-gray-300"
        modules={[A11y, Pagination, Keyboard, Autoplay]}
        onSwiper={setSwiper}
        slidesPerView={1}
        direction={"horizontal"}
        loop={true}
        keyboard={{ enabled: true, onlyInViewport: true }}
        pagination={{ clickable: true }}
        speed={900}
        autoplay={autoplayOptions}
        a11y={{
          enabled: true,
          containerMessage: "Featured collections carousel",
          slideLabelMessage: "Slide {{index}} of {{slidesLength}}",
          paginationBulletMessage: "Go to slide {{index}}",
        }}
        effect={"slide"}
      >
        {slides.map((slide, index) => {
          const text = (
            <div className="flex w-full items-center justify-center px-6 py-10 sm:w-1/2 sm:py-0">
              <div className="hero-text text-[#414141]">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-[2px] w-8 bg-[#414141] md:w-11"
                  ></span>
                  <p className="text-sm font-medium md:text-base">
                    {slide.eyebrow}
                  </p>
                </div>
                <h2 className="prata-regular py-1 text-3xl leading-relaxed sm:py-3 lg:text-5xl">
                  {slide.heading}
                </h2>
                <Link
                  to="/collection"
                  className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold md:text-base"
                >
                  SHOP NOW
                  <span className="sr-only">: {slide.heading}</span>
                  <span
                    aria-hidden="true"
                    className="h-[1px] w-8 bg-[#414141] transition-all group-hover:w-12 md:w-11"
                  ></span>
                </Link>
              </div>
            </div>
          );
          const image = (
            <div className="hero-media w-full overflow-hidden sm:w-1/2">
              <img
                className="h-64 w-full object-cover object-center xs:h-72 sm:h-96"
                src={slide.image}
                alt=""
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding="async"
              />
            </div>
          );
          return (
            <SwiperSlide key={slide.heading}>
              <div
                className={`flex bg-white sm:flex-row ${slide.imageFirst ? "flex-col" : "flex-col-reverse"}`}
              >
                {slide.imageFirst ? (
                  <>
                    {image}
                    {text}
                  </>
                ) : (
                  <>
                    {text}
                    {image}
                  </>
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <button
        type="button"
        onClick={() => setIsPlaying((prev) => !prev)}
        className="absolute bottom-2 right-2 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white/90 text-gray-900 shadow-sm transition duration-200 hover:bg-white active:scale-95"
        aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
    </section>
  );
};

export default Hero;

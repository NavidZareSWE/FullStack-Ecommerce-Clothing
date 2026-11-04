import Title from "../components/Title";
import NewsLetterBox from "../components/NewsletterBox";
import { assets } from "../assets/assets";

const reasons = [
  {
    title: "Quality Assurance:",
    text: "We meticulously select and vet each product to ensure it meets our stringent quality standards.",
  },
  {
    title: "Convenience:",
    text: "With our user-friendly interface and hassle-free ordering process, shopping has never been easier.",
  },
  {
    title: "Exceptional Customer Service:",
    text: "Our team of dedicated professionals are here to assist you the way, ensuring your satisfaction is our top priority.",
  },
];

const About = () => {
  return (
    <div>
      <div className="pt-8 text-center text-2xl">
        <Title as="h1" text1={"ABOUT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col gap-10 md:flex-row md:gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.about_img}
          alt="Flat lay of blue jeans, a knit cardigan and tan ankle boots"
        />
        <div className="flex flex-col justify-center gap-6 leading-relaxed text-gray-600 md:w-2/4">
          <p>
            Forever was born out of a passion for innovation and a desire to
            revolutionize the way people shop online. Our journey began with a
            simple idea: to provide a platform where customers can easily
            discover, explore, and purchase a wide range of products from the
            comfort of their homes.
          </p>
          <p>
            Since our inception, we&apos;ve worked tirelessly to curate a
            diverse selection of high-quality products that cater to every taste
            and preference. From fashion and beauty to electronics and home
            essentials, we offer an extensive collection sourced from trusted
            brands and suppliers.
          </p>
          <h2 className="font-bold text-gray-800">Our Mission</h2>
          <p>
            Our mission at Forever is to empower the customers with choice,
            convenience, and confidence. We&apos;re dedicated to provide a
            seamless shopping experience that exceed expectations, from browsing
            and ordering to delivery and beyond
          </p>
        </div>
      </div>
      <section aria-labelledby="why-heading">
        <div className="py-4 text-2xl sm:text-4xl">
          <Title id="why-heading" text1={"WHY"} text2={"CHOOSE US"} />
        </div>
        <ul role="list" className="mb-20 flex flex-col text-sm md:flex-row">
          {reasons.map((reason) => (
            <li
              key={reason.title}
              className="-mt-px flex flex-1 flex-col gap-5 border px-6 py-8 sm:px-10 sm:py-16 md:-ml-px md:mt-0 md:px-12"
            >
              <h3 className="font-bold text-gray-900">{reason.title}</h3>
              <p className="text-gray-600">{reason.text}</p>
            </li>
          ))}
        </ul>
      </section>
      <NewsLetterBox />
    </div>
  );
};

export default About;

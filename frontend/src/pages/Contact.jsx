import Title from "../components/Title";
import { assets } from "../assets/assets";
const Contact = () => {
  return (
    <div>
      <div className="pt-10 text-center text-2xl">
        <Title as="h1" text1={"CONTACT"} text2={"US"} />
      </div>
      <div className="my-10 mb-20 flex flex-col justify-center gap-10 md:mb-28 md:flex-row">
        <img
          className="w-full md:max-w-[480px]"
          src={assets.contact_img}
          alt="Desk with a laptop, a smartphone, a cup of coffee and a small plant"
        />
        <div className="flex flex-col items-start justify-center gap-6">
          <h2 className="text-xl font-semibold text-gray-700">Our Store</h2>
          <address className="not-italic text-gray-600">
            <span className="font-semibold">(Not Real Address)</span>
            <br />
            Forever Store 1234 <br /> Elm Street Springfield, IL 62704, USA
          </address>
          <p className="text-gray-600">
            Tel: +98-9xx xx xx xxx
            <br />
            Email:{" "}
            <a
              href="mailto:navidzare7775@gmail.com"
              className="break-all underline-offset-4 hover:text-black hover:underline"
            >
              navidzare7775@gmail.com
            </a>
          </p>
          <h2 className="text-xl font-semibold text-gray-700">
            Careers at Forever
          </h2>
          <p className="text-gray-600">
            Learn more about our teams and job openings.
          </p>
          <button type="button" className="btn-secondary px-8 py-4">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;

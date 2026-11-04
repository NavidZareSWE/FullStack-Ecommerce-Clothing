import { assets } from "../assets/assets";

const policies = [
  {
    icon: assets.exchange_icon,
    title: "Easy Exchange Policy",
    text: "We Offer hassle free exchange policy",
  },
  {
    icon: assets.quality_icon,
    title: "7 Days Return Policy",
    text: "We provide 7 days free return policy",
  },
  {
    icon: assets.support_img,
    title: "Best Customer Support",
    text: "We provide 24/7 customer support",
  },
];

const OurPolicy = () => {
  return (
    <section aria-label="Our policies" className="py-16 sm:py-20">
      <ul
        role="list"
        className="grid grid-cols-1 gap-10 text-center text-sm text-gray-700 sm:grid-cols-3 sm:gap-4 md:text-base"
      >
        {policies.map((policy, index) => (
          <li
            key={policy.title}
            className="Policy"
            data-reveal
            style={{ "--reveal-delay": `${index * 100}ms` }}
          >
            <img
              src={policy.icon}
              className="m-auto mb-5 w-12"
              alt=""
              loading="lazy"
            />
            <h3 className="font-semibold text-gray-900">{policy.title}</h3>
            <p className="mt-1 text-gray-600">{policy.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default OurPolicy;

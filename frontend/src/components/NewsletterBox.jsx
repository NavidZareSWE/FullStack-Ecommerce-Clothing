const NewsletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };
  return (
    <section
      data-reveal
      className="py-8 text-center sm:py-12"
      aria-labelledby="newsletter-heading"
    >
      <h2
        id="newsletter-heading"
        className="text-xl font-medium text-gray-800 sm:text-2xl"
      >
        Subscribe now & get 20% off
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-gray-600">
        Unlock exclusive deals by subscribing now and enjoy a fabulous 20%
        discount on your favorite clothing items!{" "}
        <span aria-hidden="true">🛍️✨</span>
      </p>
      <form
        onSubmit={onSubmitHandler}
        className="mx-auto my-6 flex w-full max-w-xl flex-col gap-3 xs:flex-row xs:items-stretch xs:gap-0 xs:border xs:border-gray-400 xs:focus-within:border-black"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          className="min-h-12 w-full border border-gray-400 px-4 text-base outline-none placeholder:text-gray-500 focus:border-black xs:flex-1 xs:border-0"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="Enter your email"
          required
        />
        <button
          type="submit"
          className="min-h-12 bg-black px-8 text-sm font-medium tracking-wide text-white transition duration-200 hover:bg-gray-800 active:scale-[0.98]"
        >
          SUBSCRIBE
        </button>
      </form>
    </section>
  );
};

export default NewsletterBox;

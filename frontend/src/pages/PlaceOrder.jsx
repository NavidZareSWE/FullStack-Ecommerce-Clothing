import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { useContext, useRef, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import style from "./PlaceOrder.module.css";
import axios from "axios";

// Iranian mobile number: 09xxxxxxxxx or +989xxxxxxxxx / 989xxxxxxxxx
const PHONE_PATTERN = "((09)|(\\+?989))[0-9]{9}";

const Field = ({
  label,
  name,
  value,
  onChange,
  showErrors,
  hint,
  errorMessage,
  className = "",
  ...inputProps
}) => {
  const id = `checkout-${name}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = `${id}-error`;
  const isEmpty = !value || String(value).trim() === "";
  const patternMismatch =
    !isEmpty &&
    inputProps.pattern &&
    !new RegExp(`^(?:${inputProps.pattern})$`).test(value);
  const invalid = showErrors && (isEmpty || patternMismatch);
  return (
    <div className={`min-w-0 ${className}`}>
      <label htmlFor={id} className="form-label">
        {label}{" "}
        <span aria-hidden="true" className="text-red-700">
          *
        </span>
      </label>
      <input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required
        aria-invalid={invalid || undefined}
        aria-describedby={
          [hintId, invalid ? errorId : null].filter(Boolean).join(" ") ||
          undefined
        }
        className="form-input"
        {...inputProps}
      />
      {hint && (
        <p id={hintId} className="mt-1 text-xs text-gray-600">
          {hint}
        </p>
      )}
      {invalid && (
        <p id={errorId} className="form-error animate-fade-in">
          {isEmpty ? `${label} is required.` : errorMessage}
        </p>
      )}
    </div>
  );
};

const paymentOptions = [
  { value: "sepah", label: "Bank Sepah", logo: assets.Sepah_logo },
  { value: "tejarat", label: "Bank Tejarat", logo: assets.Tejarat_Logo },
  { value: "cod", label: "Cash on delivery" },
];

const PlaceOrder = () => {
  const {
    navigate,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    BACKEND_URL,
    products,
  } = useContext(ShopContext);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    state: "",
    city: "",
    street: "",
    address: "",
    zipcode: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    try {
      let orderItems = [];
      for (const items in cartItems)
        for (const item in cartItems[items])
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items),
            );
            if (itemInfo) itemInfo.size = item;
            itemInfo.quanitity = cartItems[items][item];
            orderItems.push(itemInfo);
          }
      let orderData = {
        address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          country: formData.country,
          city: formData.city,
          state: formData.state,
          street: formData.street,
          zipcode: formData.zipcode,
        },
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };
      switch (paymentMethod) {
        case "cod":
          {
            setIsSubmitting(true);
            const response = await axios.post(
              BACKEND_URL + "/api/order/place",
              orderData,
              { headers: { token } },
            );
            if (response.data.success) {
              setCartItems({});
              navigate("/orders");
              toast.success("Your order has been placed.");
            } else {
              toast.error(response.data.message);
            }
          }
          break;

        default:
          // Online bank payments are not implemented yet
          toast.info(
            "This payment method isn't available yet. Please choose Cash on delivery.",
          );
          break;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Runs before native validation: list every missing required field
  const reportMissingFields = () => {
    setShowErrors(true);
    const inputs = formRef.current?.querySelectorAll("input:required") ?? [];
    const inputsNotFilled = [];
    inputs.forEach((input) => {
      if (input.value.trim() === "") {
        const label = formRef.current.querySelector(`label[for="${input.id}"]`);
        inputsNotFilled.push(
          label ? label.textContent.replace("*", "").trim() : input.name,
        );
      }
    });
    if (inputsNotFilled.length > 0) {
      toast.error(
        <div>
          <p>Fill out the required fields:</p>
          <ul className="mt-1 list-disc pl-5">
            {inputsNotFilled.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>,
      );
    }
  };

  const fieldProps = (name) => ({
    name,
    value: formData[name],
    onChange: onChangeHandler,
    showErrors,
  });

  return (
    <form
      ref={formRef}
      onSubmit={onSubmitHandler}
      onInvalidCapture={() => setShowErrors(true)}
      className="flex min-h-[80vh] flex-col justify-between gap-10 pt-6 md:flex-row md:gap-8 md:pt-14"
    >
      {/*----------------------- Left Side -----------------------*/}
      <fieldset className="flex w-full min-w-0 flex-col gap-3 md:max-w-[480px]">
        <legend className="mb-3 text-xl sm:text-2xl">
          <Title as="h1" text1={"DELIVERY"} text2={"INFORMATION"} />
        </legend>
        <p className={style.req}>
          Fields marked with <span aria-hidden="true">*</span>
          <span className="sr-only">an asterisk</span> are required.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="First name"
            autoComplete="given-name"
            {...fieldProps("firstName")}
          />
          <Field
            label="Last name"
            autoComplete="family-name"
            {...fieldProps("lastName")}
          />
        </div>
        <Field
          label="Email address"
          type="email"
          inputMode="email"
          autoComplete="email"
          {...fieldProps("email")}
        />
        <Field
          label="Street"
          autoComplete="address-line1"
          {...fieldProps("street")}
        />
        <Field
          label="Address"
          hint="Apartment, building, unit, floor, etc."
          autoComplete="address-line2"
          {...fieldProps("address")}
        />
        <div className="grid grid-cols-3 gap-3">
          <Field
            label="Country"
            autoComplete="country-name"
            {...fieldProps("country")}
          />
          <Field
            label="State"
            autoComplete="address-level1"
            {...fieldProps("state")}
          />
          <Field
            label="City"
            autoComplete="address-level2"
            {...fieldProps("city")}
          />
        </div>
        <Field
          label="Zip code"
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          {...fieldProps("zipcode")}
        />
        <Field
          label="Phone number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          pattern={PHONE_PATTERN}
          maxLength="13"
          hint="Mobile number, e.g. 09123456789 or +989123456789"
          errorMessage="Enter a valid mobile number, e.g. 09123456789."
          title="Mobile number, e.g. 09123456789 or +989123456789"
          {...fieldProps("phone")}
        />
      </fieldset>
      {/*----------------------- Right Side -----------------------*/}
      <div className="w-full md:mt-8 md:max-w-md">
        <div className="md:mt-8">
          <CartTotal />
        </div>
        <fieldset className="mt-12">
          <legend className="text-xl sm:text-2xl">
            <Title text1={"PAYMENT"} text2={"METHOD"} />
          </legend>
          {/*----------------------- Payment Method Selection -----------------------*/}
          <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap">
            {paymentOptions.map((option) => (
              <label
                key={option.value}
                className={`flex min-h-12 cursor-pointer items-center gap-3 border p-2 px-3 transition duration-200 active:scale-[0.99] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-black ${
                  paymentMethod === option.value
                    ? "border-green-700 bg-green-50"
                    : "border-gray-300 hover:border-gray-500"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={option.value}
                  checked={paymentMethod === option.value}
                  onChange={() => setPaymentMethod(option.value)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`h-4 w-4 min-w-4 rounded-full border-2 transition duration-300 ease-in-out ${
                    paymentMethod === option.value
                      ? "border-green-700 bg-green-600"
                      : "border-gray-500"
                  }`}
                ></span>
                {option.logo ? (
                  <>
                    <img className="mx-2 h-6" src={option.logo} alt="" />
                    <span className="text-sm font-medium text-gray-700">
                      {option.label}
                    </span>
                  </>
                ) : (
                  <span className="mx-2 text-sm font-medium uppercase text-gray-700">
                    {option.label}
                  </span>
                )}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="mt-8 w-full text-center md:text-end">
          <button
            type="submit"
            onClick={reportMissingFields}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="btn-primary w-full px-16 sm:w-auto"
          >
            {isSubmitting ? "PLACING ORDER…" : "PLACE ORDER"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;

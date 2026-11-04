import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { TOKEN_STORAGE_KEY } from "../constants/storage";

const EyeIcon = ({ off }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="M3 3l18 18" />}
  </svg>
);

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, navigate, BACKEND_URL } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignUp = currentState === "Sign Up";

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (currentState === "Sign Up") {
        const response = await axios.post(BACKEND_URL + "/api/user/register", {
          name,
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem(TOKEN_STORAGE_KEY, response.data.token);
          toast.success(`Welcome ${name}, We hope you enjoy your stay!`);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(BACKEND_URL + "/api/user/login", {
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem(TOKEN_STORAGE_KEY, response.data.token);
          toast.success(`Welcome Back!`);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  const switchMode = (mode) => {
    setCurrentState(mode);
    setShowPassword(false);
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="m-auto mt-10 flex w-full max-w-sm flex-col gap-4 text-gray-800 sm:mt-14"
      aria-describedby="login-mode-note"
    >
      <div className="mb-2 mt-6 inline-flex items-center gap-2 self-center sm:mt-10">
        <h1 className="prata-regular text-3xl">{currentState}</h1>
        <hr
          aria-hidden="true"
          className="h-[1.5px] w-8 border-none bg-gray-800"
        />
      </div>
      <p id="login-mode-note" className="sr-only" aria-live="polite">
        {isSignUp
          ? "Create a new account form."
          : "Sign in to your account form."}
      </p>
      {isSignUp ? (
        <div>
          <label htmlFor="login-name" className="form-label">
            Name
          </label>
          <input
            id="login-name"
            type="text"
            className="form-input bg-slate-50"
            autoComplete="name"
            required
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
      ) : (
        ""
      )}
      <div>
        <label htmlFor="login-email" className="form-label">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          inputMode="email"
          className="form-input bg-slate-50"
          autoComplete="email"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </div>
      <div>
        <label htmlFor="login-password" className="form-label">
          Password
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            className="form-input bg-slate-50 pr-12"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            aria-describedby={isSignUp ? "password-hint" : undefined}
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-gray-600 hover:text-black"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            aria-controls="login-password"
          >
            <EyeIcon off={showPassword} />
          </button>
        </div>
        {isSignUp && (
          <p id="password-hint" className="mt-1.5 text-xs text-gray-600">
            Use at least 9 characters, including an uppercase letter, a
            lowercase letter, a number and a symbol.
          </p>
        )}
      </div>
      <div className="flex w-full flex-wrap justify-between gap-2 text-sm">
        <button
          type="button"
          onClick={() =>
            toast.info(
              "Password reset isn't available yet. Please contact us for help.",
            )
          }
          className="min-h-11 text-left underline-offset-4 hover:text-orange-900 hover:underline active:text-gray-900"
        >
          Forgot your password?
        </button>
        {isSignUp ? (
          <button
            type="button"
            onClick={() => switchMode("Login")}
            className="min-h-11 text-sm font-medium underline-offset-4 hover:text-orange-900 hover:underline active:text-gray-900"
          >
            Login Here
          </button>
        ) : (
          <button
            type="button"
            onClick={() => switchMode("Sign Up")}
            className="min-h-11 text-sm font-medium underline-offset-4 hover:text-orange-900 hover:underline active:text-gray-900"
          >
            Create Account
          </button>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="btn-primary mt-2 w-full font-light"
      >
        {isSubmitting
          ? "Please wait…"
          : currentState === "Sign Up"
            ? "Sign Up"
            : "Sign in"}
      </button>
    </form>
  );
};

export default Login;

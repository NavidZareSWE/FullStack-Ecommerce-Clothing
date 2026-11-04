import { useState } from "react";
import axios from "axios";
import { backendURL } from "../config";
import { toast } from "react-toastify";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await axios.post(backendURL + "/api/user/admin", {
        email,
        password,
      });

      if (response.data.success) {
        setToken(response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <main
      id="admin-main"
      className="flex min-h-screen w-full items-center justify-center px-4 py-10"
    >
      <div className="w-full max-w-md animate-fade-in-up rounded-lg bg-white px-6 py-8 shadow-md sm:px-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Admin Panel</h1>
        <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="admin-email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="admin-email"
              className="w-full rounded-md px-3 py-2"
              type="email"
              inputMode="email"
              autoComplete="username"
              placeholder="example@example.com"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div>
            <label
              htmlFor="admin-password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                className="w-full rounded-md py-2 pl-3 pr-16"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-pressed={showPassword}
                aria-controls="admin-password"
                className="absolute inset-y-0 right-0 min-w-14 px-3 text-sm font-medium text-gray-700 hover:text-black"
              >
                {showPassword ? "Hide" : "Show"}
                <span className="sr-only"> password</span>
              </button>
            </div>
          </div>
          <button
            className="mt-2 min-h-11 w-full rounded-md bg-black px-4 py-2 text-white transition duration-200 hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-500"
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "Signing in…" : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;

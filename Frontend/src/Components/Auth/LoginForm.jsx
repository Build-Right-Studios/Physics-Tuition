// Components/auth/LoginForm.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AUTH, BASE } from "../../Constants/apiRoutes";

const BASE_URL = BASE.ROUTE;

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}${AUTH.LOGIN}`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      const { success, user, token } = response.data;

      if (success) {
        // Persist auth data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Handle remember me
        if (rememberMe) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("rememberedEmail", email);
        } else {
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("user", JSON.stringify(user));
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }

        toast.success("Login successful! Redirecting...", {
          autoClose: 1500,
        });

        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1800);
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} noValidate className="w-full">
      {/* Email Field */}
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-slate-700 mb-1.5"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="admin@physicsinstitute.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400
                     focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
        />
      </div>

      {/* Password Field */}
      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-slate-700 mb-1.5"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400
                       focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label="Toggle password visibility"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200 text-base"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
      </div>

      {/* Remember Me + Forgot Password */}
      <div className="flex items-center justify-between mb-6">
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
          />
          Remember me
        </label>
        <button
          type="button"
          onClick={() =>
            toast.info("Forgot password flow coming soon!", {
              position: "top-center",
            })
          }
          className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          Forgot password?
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3.5 rounded-xl text-white text-base font-bold tracking-wide transition-all duration-200
          ${loading
            ? "bg-blue-400 cursor-not-allowed opacity-70"
            : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-md hover:shadow-lg"
          }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Logging in...
          </span>
        ) : (
          "Log In"
        )}
      </button>
    </form>
  );
}
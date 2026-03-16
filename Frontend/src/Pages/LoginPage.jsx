// Pages/LoginPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginHeader from "../Components/auth/LoginHeader.jsx";
import LoginForm from "../Components/auth/LoginForm";
import LoginFooter from "../Components/auth/LoginFooter";

export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 flex flex-col items-center justify-center px-4 py-8">

      {/* Toast Notifications */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        toastClassName="rounded-xl text-sm font-medium shadow-lg"
        progressClassName="bg-white/40"
        theme="colored"
      />

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl px-8 py-10 sm:px-10">
        <LoginHeader />
        <LoginForm />
        <LoginFooter />
      </div>
    </div>
  );
}
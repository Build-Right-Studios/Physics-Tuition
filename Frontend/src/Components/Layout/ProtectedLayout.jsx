// Components/layout/ProtectedLayout.jsx
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardNavbar from "../dashboard/DashboardNavbar";

export default function ProtectedLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 font-inter">
      <ToastContainer position="top-center" autoClose={2500} theme="colored" />
      <DashboardNavbar />
      <main className="max-w-lg mx-auto pb-8">
        <Outlet />
      </main>
    </div>
  );
}
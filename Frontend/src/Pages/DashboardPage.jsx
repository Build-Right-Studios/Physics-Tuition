// Pages/DashboardPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PlatformOverview from "../Components/Dashboard/PlatformOverview.jsx";
import QuickManagement from "../Components/Dashboard/QuickManagement.jsx";
import CoreTasks from "../Components/Dashboard/CoreTasks.jsx";

export default function DashboardPage() {
  const navigate = useNavigate();

  // Guard — redirect to login if no token
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 font-inter">
      <ToastContainer position="top-center" autoClose={2000} theme="colored" />

      {/* Scrollable Content */}
      <main className="max-w-lg mx-auto pb-6">
        <PlatformOverview />
        <QuickManagement />
        <CoreTasks />
      </main>
    </div>
  );
}
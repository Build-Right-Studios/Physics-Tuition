// Components/dashboard/DashboardNavbar.jsx
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function DashboardNavbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        toast.success("Logged out successfully!");
        setTimeout(() => {
            navigate("/login", { replace: true });
        }, 1000);
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50 px-5 py-3.5 flex items-center justify-between">
            {/* Logo / Name */}

            <span
                onClick={() => navigate("/dashboard")}
                className="text-lg font-bold text-slate-800 font-inter tracking-tight cursor-pointer hover:text-blue-600 transition-colors duration-200"
            >
                Question Desk
            </span>

            {/* User Icon / Logout */}
            <button
                onClick={handleLogout}
                title="Logout"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 1114 0H5z"
                        clipRule="evenodd"
                    />
                </svg>
                <span className="text-white text-sm font-semibold font-inter">Logout</span>
            </button>
        </nav>
    );
}
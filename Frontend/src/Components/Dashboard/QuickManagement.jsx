// Components/dashboard/QuickManagement.jsx
import { useNavigate } from "react-router-dom";

const actions = [
  {
    id: "add-chapter",
    label: "ADD CHAPTER",
    description: "Create new physics curriculum modules",
    icon: "📘",
    bg: "bg-blue-600",
    hover: "hover:bg-blue-700",
    route: "/chapters/add",
  },
  {
    id: "add-subtopic",
    label: "ADD SUB TOPIC",
    description: "Organize chapters into detailed concepts",
    icon: "🗂️",
    bg: "bg-emerald-500",
    hover: "hover:bg-emerald-600",
    route: "/subtopics/add",
  },
  {
    id: "add-students",
    label: "ADD STUDENTS",
    description: "Register new students to the platform",
    icon: "👤",
    bg: "bg-slate-800",
    hover: "hover:bg-slate-900",
    route: "/students/add",
  },
];

export default function QuickManagement() {
  const navigate = useNavigate();

  return (
    <section className="px-4 mt-6">
      <h2 className="text-base font-bold text-slate-800 font-inter mb-3">
        Quick Management
      </h2>

      <div className="flex flex-col gap-3">
        {actions.map((a) => (
          <button
            key={a.id}
            onClick={() => navigate(a.route)}
            className={`${a.bg} ${a.hover} rounded-2xl px-5 py-4 flex items-center gap-4 transition-colors duration-200 shadow-sm text-left w-full`}
          >
            {/* Icon Box */}
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-xl">{a.icon}</span>
            </div>

            {/* Text */}
            <div>
              <p className="text-white font-bold text-sm font-inter tracking-wide">
                {a.label}
              </p>
              <p className="text-white/70 text-xs font-inter mt-0.5">
                {a.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
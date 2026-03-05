// Components/dashboard/CoreTasks.jsx
import { useNavigate } from "react-router-dom";

const tasks = [
  {
    id: "add-question",
    label: "Add New Question",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8" />
      </svg>
    ),
    route: "/questions/add",
  },
  {
    id: "generate-assignment",
    label: "Generate Assignment",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h7l5 5v13a2 2 0 01-2 2z" />
      </svg>
    ),
    route: "/assignments/generate",
  },
];

export default function CoreTasks() {
  const navigate = useNavigate();

  return (
    <section className="px-4 mt-6 mb-8">
      <h2 className="text-base font-bold text-slate-800 font-inter mb-3">
        Core Tasks
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {tasks.map((t) => (
          <button
            key={t.id}
            onClick={() => navigate(t.route)}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col items-center gap-3
                       hover:shadow-md hover:border-blue-100 transition-all duration-200"
          >
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              {t.icon}
            </div>

            {/* Label */}
            <p className="text-xs font-semibold text-slate-700 font-inter text-center">
              {t.label}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
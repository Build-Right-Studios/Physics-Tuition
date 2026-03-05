// Components/dashboard/PlatformOverview.jsx
import { useNavigate } from "react-router-dom";

const platforms = [
  { id: "jee-mains",      label: "JEE MAINS",      icon: "📚", action: "View Questions" },
  { id: "jee-advanced",   label: "JEE ADVANCED",   icon: "🔬", action: "View Questions" },
  { id: "neet",           label: "NEET",            icon: "🧬", action: "View Questions" },
  { id: "cbse",           label: "CBSE",            icon: "🎓", action: "View Questions"   },
  { id: "ncert",          label: "NCERT",           icon: "📖", action: "View Questions"   },
  { id: "ncert-exemplar", label: "NCERT EXEMPLAR",  icon: "📋", action: "View Questions"   },
];

export default function PlatformOverview() {
  const navigate = useNavigate();

  return (
    <section className="px-4 mt-5">
      <h2 className="text-base font-bold text-slate-800 font-inter mb-3">
        Platform Overview
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {platforms.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200"
          >
            {/* Icon */}
            <span className="text-2xl">{p.icon}</span>

            {/* Label */}
            <p className="text-xs font-bold text-slate-800 font-inter tracking-wide">
              {p.label}
            </p>

            {/* Action Link — all use /questions/:exam dynamically */}
            <button
              onClick={() => navigate(`/questions/${p.id}`)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 font-inter flex items-center gap-1 transition-colors duration-200 w-fit"
            >
              {p.action}
              <span className="text-sm">›</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
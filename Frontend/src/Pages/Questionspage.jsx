// Pages/QuestionsPage.jsx
import { useParams, useNavigate } from "react-router-dom";

export default function QuestionsPage() {
  const { exam } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-inter flex flex-col items-center justify-center gap-4">
      <p className="text-slate-400 text-sm">You are viewing</p>
      <h1 className="text-3xl font-bold text-slate-800 uppercase tracking-wide">
        {exam.replace(/-/g, " ")}
      </h1>
      <p className="text-slate-400 text-xs">Route: /questions/{exam}</p>
      <button
        onClick={() => navigate("/dashboard")}
        className="mt-4 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200"
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}
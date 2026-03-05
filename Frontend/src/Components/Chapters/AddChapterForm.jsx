// Components/chapters/AddChapterForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { CHAPTERS, BASE } from "../../Constants/apiRoutes";

const BASE_URL = BASE.ROUTE;

export default function AddChapterForm() {
  const navigate = useNavigate();

  const [chapterNumber, setChapterNumber] = useState("");
  const [chapterName, setChapterName]     = useState("");
  const [grade, setGrade]                 = useState("Class 11");
  const [loading, setLoading]             = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!chapterNumber || !chapterName) {
      toast.error("Chapter number and name are required.");
      return;
    }

    setLoading(true);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await axios.post(
        `${BASE_URL}${CHAPTERS.ADD}`,
        {
          grade: grade === "Class 11" ? 11 : 12,
          subject: "Physics",
          chapterNumber,
          chapterName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Chapter added successfully!");
        setChapterNumber("");
        setChapterName("");
        setGrade("Class 11");
      } else {
        toast.error("Failed to add chapter. Please try again.");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="font-inter px-4 py-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800 font-inter">Chapter Details</h1>
        <p className="text-sm text-slate-400 mt-1">
          Populate chapter information for JEE/NEET curriculum.
        </p>
      </div>

      {/* Chapter Number */}
      <div className="mb-5">
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
          Chapter Number
        </label>
        <input
          type="text"
          placeholder="e.g. 01"
          value={chapterNumber}
          onChange={(e) => setChapterNumber(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800
                     placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:ring-2
                     focus:ring-blue-100 transition-all duration-200"
        />
      </div>

      {/* Chapter Name */}
      <div className="mb-5">
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
          Chapter Name
        </label>
        <input
          type="text"
          placeholder="e.g. Kinematics"
          value={chapterName}
          onChange={(e) => setChapterName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800
                     placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:ring-2
                     focus:ring-blue-100 transition-all duration-200"
        />
      </div>

      {/* Class / Grade Toggle */}
      <div className="mb-5">
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
          Class / Grade
        </label>
        <div className="flex gap-3">
          {["Class 11", "Class 12"].map((cls) => (
            <button
              key={cls}
              type="button"
              onClick={() => setGrade(cls)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all duration-200
                ${
                  grade === cls
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
            >
              🎓 {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="flex-1 py-3.5 rounded-xl border-2 border-slate-200 text-slate-600 text-sm font-semibold
                     hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`flex-1 py-3.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2
                      transition-all duration-200
            ${loading
              ? "bg-blue-400 cursor-not-allowed opacity-70"
              : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-md"
            }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Saving...
            </>
          ) : (
            <>
              💾 Save Chapter
            </>
          )}
        </button>
      </div>

    </form>
  );
}
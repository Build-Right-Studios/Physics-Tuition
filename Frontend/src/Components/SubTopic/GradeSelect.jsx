// Components/SubTopic/GradeSelect.jsx

export default function GradeSelect({ grade, setGrade }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                Select Class
            </label>
            <div className="flex gap-2">
                {[11, 12].map((g) => (
                    <button
                        key={g}
                        type="button"
                        onClick={() => setGrade(g)}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium border transition-all duration-150
                            ${grade === g
                                ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200 font-semibold"
                                : "bg-slate-50 border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50"
                            }`}
                    >
                        Class {g}
                    </button>
                ))}
            </div>
        </div>
    );
}
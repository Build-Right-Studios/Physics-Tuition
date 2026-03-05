// Components/SubTopic/SubjectSelect.jsx

const SUBJECTS = ["Physics", "Maths", "Chemistry"];

export default function SubjectSelect({ subject, setSubject }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                Select Subject
            </label>
            <div className="flex gap-2">
                {SUBJECTS.map((s) => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => setSubject(s)}
                        className={`flex-1 py-2.5 px-2 rounded-xl text-sm font-medium border transition-all duration-150
                            ${subject === s
                                ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200 font-semibold"
                                : "bg-slate-50 border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50"
                            }`}
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
    );
}
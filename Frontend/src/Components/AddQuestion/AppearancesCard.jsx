// Components/AddQuestion/AppearancesCard.jsx

const EXAM_OPTIONS = ["NEET", "JEE Main", "JEE Advanced", "CBSE Board", "NCERT", "NCERT Exemplar"];

export default function AppearancesCard({ appearances, setAppearances }) {

    const addRow = () =>
        setAppearances([...appearances, { exam: "NEET", year: "" }]);

    const removeRow = (index) =>
        setAppearances(appearances.filter((_, i) => i !== index));

    const updateRow = (index, field, value) =>
        setAppearances(appearances.map((row, i) => i === index ? { ...row, [field]: value } : row));

    const chevron = (
        <span className="pointer-events-none absolute right-3 text-slate-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
            </svg>
        </span>
    );

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm shadow-slate-100 border border-slate-100 flex flex-col gap-4">
            {/* Card Header */}
            <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                <span className="text-blue-500 text-lg mt-0.5 flex-shrink-0">📅</span>
                <div>
                    <h2 className="text-[14.5px] font-semibold text-slate-800 tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                        Appearances
                    </h2>
                    <p className="text-[12px] text-slate-400 mt-0.5">Add exams where this question has appeared.</p>
                </div>
            </div>

            {/* Column Labels */}
            {appearances.length > 0 && (
                <div className="flex gap-3 items-center">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 flex-[2]">Exam</span>
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 flex-1">Year</span>
                    <span className="w-7" />
                </div>
            )}

            {/* Rows */}
            {appearances.map((row, index) => (
                <div key={index} className="flex gap-3 items-center">
                    {/* Exam dropdown */}
                    <div className="relative flex items-center flex-[2]">
                        <select
                            value={row.exam}
                            onChange={(e) => updateRow(index, "exam", e.target.value)}
                            className="w-full appearance-none pr-8 pl-3 py-2.5 rounded-xl border text-sm outline-none transition-all duration-150
                                bg-slate-50 text-slate-700 border-slate-200
                                focus:border-blue-500 focus:bg-blue-50 focus:ring-2 focus:ring-blue-100"
                        >
                            {EXAM_OPTIONS.map((e) => <option key={e} value={e}>{e}</option>)}
                        </select>
                        {chevron}
                    </div>

                    {/* Year input */}
                    <input
                        type="number"
                        value={row.year}
                        onChange={(e) => updateRow(index, "year", e.target.value)}
                        placeholder="2023"
                        min="2000"
                        max="2099"
                        className="flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none transition-all duration-150
                            bg-slate-50 text-slate-700 border-slate-200 placeholder:text-slate-300
                            focus:border-blue-500 focus:bg-blue-50 focus:ring-2 focus:ring-blue-100"
                    />

                    {/* Remove button */}
                    <button
                        type="button"
                        onClick={() => removeRow(index)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition-all"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
            ))}

            {/* Add row button */}
            <button
                type="button"
                onClick={addRow}
                className="flex items-center gap-1.5 text-[13px] font-semibold text-blue-500 hover:text-blue-600 transition-colors w-fit"
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Appearance
            </button>
        </div>
    );
}
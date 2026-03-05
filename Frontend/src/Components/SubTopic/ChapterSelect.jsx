// Components/SubTopic/ChapterSelect.jsx

export default function ChapterSelect({ chapters, selectedChapter, setSelectedChapter, disabled }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                Select Parent Chapter
            </label>
            <div className="relative flex items-center">
                <select
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(e.target.value)}
                    disabled={disabled || chapters.length === 0}
                    className={`w-full appearance-none pr-9 pl-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all duration-150
                        bg-slate-50 text-slate-700 border-slate-200
                        focus:border-blue-500 focus:bg-blue-50 focus:ring-2 focus:ring-blue-100
                        disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                    <option value="">
                        {disabled
                            ? "Select class & subject first..."
                            : chapters.length === 0
                            ? "Loading chapters..."
                            : "Select a chapter..."}
                    </option>
                    {chapters.map((chapter, index) => (
                        <option key={index} value={chapter}>
                            {chapter} {/* ✅ chapters is string[], not objects */}
                        </option>
                    ))}
                </select>
                <span className="pointer-events-none absolute right-3 text-slate-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </span>
            </div>
        </div>
    );
}
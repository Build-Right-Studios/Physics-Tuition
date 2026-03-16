const DIFFICULTY_COLORS = {
    Easy:   "bg-green-50 text-green-600 border border-green-200",
    Medium: "bg-amber-50 text-amber-600 border border-amber-200",
    Hard:   "bg-red-50 text-red-500 border border-red-200",
};

export default function QuestionSelectStep({ questions, selectedIds, toggleQuestion, selectAll, clearAll }) {
    if (!questions.length) return null;

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div className="flex items-start gap-3">
                    <span className="text-blue-500 text-lg mt-0.5">📝</span>
                    <div>
                        <h2 className="text-[14.5px] font-semibold text-slate-800 tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                            Select Questions
                        </h2>
                        <p className="text-[12px] text-slate-400 mt-0.5">{selectedIds.length} of {questions.length} selected</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={selectAll}  className="text-[11px] font-semibold text-blue-600 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all">All</button>
                    <button onClick={clearAll}   className="text-[11px] font-semibold text-slate-500 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all">Clear</button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                {questions.map((q, i) => (
                    <div
                        key={q._id}
                        onClick={() => toggleQuestion(q._id)}
                        className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                            ${selectedIds.includes(q._id)
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-200 bg-slate-50 hover:border-slate-300"
                            }`}
                    >
                        {/* Checkbox */}
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all
                            ${selectedIds.includes(q._id)
                                ? "border-blue-500 bg-blue-500"
                                : "border-slate-300 bg-white"
                            }`}
                        >
                            {selectedIds.includes(q._id) && (
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            )}
                        </div>

                        <div className="flex flex-col gap-1 flex-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-400 font-mono">Q{i + 1}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${DIFFICULTY_COLORS[q.difficulty] || ""}`}>
                                    {q.difficulty}
                                </span>
                            </div>
                            <p className="text-[13px] text-slate-700 leading-relaxed line-clamp-2">
                                {q.statement || "No statement available."}
                            </p>
                            <p className="text-[11px] text-slate-400">
                                {q.subTopic?.name || q.chapter?.name || ""}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
const DIFFICULTY_COLORS = {
    Easy:   "bg-green-50 text-green-600 border border-green-200",
    Medium: "bg-amber-50 text-amber-600 border border-amber-200",
    Hard:   "bg-red-50 text-red-500 border border-red-200",
};

export default function QuestionCard({ question, onClick }) {
    return (
        <div
            onClick={() => onClick(question)}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3 cursor-pointer hover:shadow-md hover:border-slate-200 transition-all duration-200 active:scale-[0.99]"
        >
            {/* Header — difficulty + id */}
            <div className="flex items-center justify-between gap-2">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg ${DIFFICULTY_COLORS[question.difficulty] || ""}`}>
                    {question.difficulty?.toUpperCase()}
                </span>
                <span className="text-[10px] text-slate-300 font-mono truncate max-w-[120px]">
                    {question.qdrantId?.slice(0, 8)}...
                </span>
            </div>

            {/* Statement */}
            <p className="text-[13px] text-slate-700 font-medium leading-relaxed line-clamp-2">
                {question.statement || "No statement available."}
            </p>

            {/* Chapter + Tags */}
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span>📖</span>
                    <span className="truncate">
                        {question.chapter?.name || "—"} • {question.subTopic?.name || "—"}
                    </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                    {question.tags?.map(tag => (
                        <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                            {tag}
                        </span>
                    ))}
                    {question.appearances?.length > 0 && (
                        <span className="text-[10px] text-slate-400">
                            PYQ {question.appearances[question.appearances.length - 1]?.year}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
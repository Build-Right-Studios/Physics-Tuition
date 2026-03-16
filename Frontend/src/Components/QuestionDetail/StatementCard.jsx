const DIFFICULTY_COLORS = {
    Easy:   "bg-green-50 text-green-600 border border-green-200",
    Medium: "bg-amber-50 text-amber-600 border border-amber-200",
    Hard:   "bg-red-50 text-red-500 border border-red-200",
};

export default function StatementCard({ statement, difficulty, qdrantId }) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg ${DIFFICULTY_COLORS[difficulty] || ""}`}>
                    {difficulty}
                </span>
                <span className="text-[10px] text-slate-300 font-mono">
                    {qdrantId?.slice(0, 8)}...
                </span>
            </div>
            <p className="text-[14px] text-slate-700 leading-relaxed">
                {statement || "No statement available."}
            </p>
        </div>
    );
}
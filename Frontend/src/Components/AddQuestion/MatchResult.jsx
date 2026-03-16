// Components/AddQuestion/MatchResult.jsx

const CONFIDENCE_COLORS = {
    high:   "bg-red-50 text-red-500 border-red-200",
    medium: "bg-amber-50 text-amber-600 border-amber-200",
    low:    "bg-blue-50 text-blue-600 border-blue-200",
};

function MatchCard({ match, onEdit }) {
    const scorePercent = Math.round((match.similarity_score || 0) * 100);
    const scoreColor   = CONFIDENCE_COLORS[match.confidence] || CONFIDENCE_COLORS.low;

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm shadow-slate-100 border border-slate-100 flex flex-col gap-3">
            {/* Score badge + source */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-0.5">
                    <span className="text-[12px] font-semibold text-slate-700">
                        {match.source || "—"}
                    </span>
                    <span className="text-[11px] text-slate-400">
                        {match.subject || "—"}
                    </span>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border flex-shrink-0 ${scoreColor}`}>
                    {scorePercent}% match
                </span>
            </div>

            {/* Question text/latex preview */}
            <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-3">
                {match.text || match.latex || "No preview available."}
            </p>

            {/* Match reason */}
            {match.match_reason && (
                <p className="text-[11px] text-slate-400 italic line-clamp-2">
                    {match.match_reason}
                </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border ${scoreColor}`}>
                        {match.confidence} confidence
                    </span>
                    {match.year && (
                        <span className="text-[11px] text-slate-400">{match.year}</span>
                    )}
                </div>
                <button
                    onClick={() => onEdit(match)}
                    className="text-[12px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-all flex-shrink-0 ml-2"
                >
                    Edit
                </button>
            </div>
        </div>
    );
}

export default function MatchResult({ matches, saving, onSaveAnyway, onEdit }) {
    return (
        <div className="flex flex-col gap-4">
            {/* Amber warning banner */}
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3.5">
                <span className="text-amber-500 text-lg flex-shrink-0 mt-0.5">⚠️</span>
                <div>
                    <p className="text-[13px] font-semibold text-amber-700">Similar questions found</p>
                    <p className="text-[12px] text-amber-600 mt-0.5">
                        Review before saving — edit an existing one or save as new.
                    </p>
                </div>
            </div>

            {/* Match cards */}
            {matches.map((match, i) => (
                <MatchCard key={match.question_id || i} match={match} onEdit={onEdit} />
            ))}

            {/* Save Anyway button */}
            <button
                onClick={onSaveAnyway}
                disabled={saving}
                className="w-full py-3 rounded-xl text-sm font-semibold text-slate-600
                    bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300
                    active:scale-[0.98] transition-all duration-150
                    disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
            >
                {saving ? (
                    <>
                        <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Saving...
                    </>
                ) : (
                    "Save Anyway — This is a New Question"
                )}
            </button>
        </div>
    );
}
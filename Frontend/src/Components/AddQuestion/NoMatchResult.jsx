import AnswerCard from "./AnswerCard";

const DIFFICULTY_COLORS = {
    Easy:   "bg-green-50 text-green-600 border border-green-200",
    Medium: "bg-amber-50 text-amber-600 border border-amber-200",
    Hard:   "bg-red-50 text-red-500 border border-red-200",
};

export default function NoMatchResult({ formData, saving, onSave, answer, setAnswer, prefillOptions }) {
    return (
        <div className="flex flex-col gap-4">
            {/* Success state */}
            <div className="bg-white rounded-2xl p-6 shadow-sm shadow-slate-100 border border-slate-100 flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-2xl">
                    ✅
                </div>
                <div>
                    <h2 className="text-[15px] font-bold text-slate-800" style={{ fontFamily: "'Sora', sans-serif" }}>
                        No Similar Questions Found
                    </h2>
                    <p className="text-[12px] text-slate-400 mt-1">This appears to be a unique question.</p>
                </div>
            </div>

            {/* Preview card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm shadow-slate-100 border border-slate-100 flex flex-col gap-3">
                <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                    <span className="text-blue-500 text-lg mt-0.5">📋</span>
                    <div>
                        <h2 className="text-[14.5px] font-semibold text-slate-800 tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                            Question Summary
                        </h2>
                        <p className="text-[12px] text-slate-400 mt-0.5">Review before saving.</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Class</span>
                        <span className="text-[13px] text-slate-700 font-medium">Class {formData.grade}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Subject</span>
                        <span className="text-[13px] text-slate-700 font-medium">{formData.subject}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Chapter</span>
                        <span className="text-[13px] text-slate-700 font-medium text-right max-w-[60%]">{formData.chapter}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">SubTopic</span>
                        <span className="text-[13px] text-slate-700 font-medium text-right max-w-[60%]">{formData.subTopic}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Difficulty</span>
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-lg ${DIFFICULTY_COLORS[formData.difficulty] || ""}`}>
                            {formData.difficulty}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Tags</span>
                        <div className="flex gap-1.5 flex-wrap justify-end">
                            {formData.tags.map((tag) => (
                                <span key={tag} className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Answer Card */}
            <AnswerCard
                answer={answer}
                setAnswer={setAnswer}
                prefillOptions={prefillOptions}
            />

            {/* Save button */}
            <button
                onClick={onSave}
                disabled={saving}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white
                    bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all duration-150
                    disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2
                    shadow-sm shadow-blue-200 mb-4"
            >
                {saving ? (
                    <>
                        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Saving...
                    </>
                ) : (
                    <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                            <polyline points="17 21 17 13 7 13 7 21" />
                            <polyline points="7 3 7 8 15 8" />
                        </svg>
                        Save Question
                    </>
                )}
            </button>
        </div>
    );
}
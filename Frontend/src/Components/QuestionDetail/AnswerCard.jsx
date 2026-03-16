export default function AnswerCard({ answer }) {
    if (!answer) return null;
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Answer</p>

            {answer.type === "mcq" && (
                <div className="flex flex-col gap-2">
                    {answer.options?.map(option => (
                        <div
                            key={option.label}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all
                                ${answer.correct === option.label
                                    ? "border-green-400 bg-green-50"
                                    : "border-slate-200 bg-slate-50"
                                }`}
                        >
                            <span className={`text-[12px] font-bold w-5 flex-shrink-0
                                ${answer.correct === option.label ? "text-green-600" : "text-slate-400"}`}
                            >
                                {option.label}
                            </span>
                            {option.imageUrl ? (
                                <img src={option.imageUrl} alt={`Option ${option.label}`} className="h-10 object-contain" />
                            ) : (
                                <span className="text-[13px] text-slate-700">{option.text}</span>
                            )}
                            {answer.correct === option.label && (
                                <span className="ml-auto text-[10px] font-bold text-green-600">✓ Correct</span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {answer.type === "numerical" && (
                <div className="flex items-center justify-between p-3 rounded-xl border border-green-400 bg-green-50">
                    <span className="text-[13px] text-slate-600">Correct Answer</span>
                    <span className="text-[14px] font-bold text-green-600">{answer.correct}</span>
                </div>
            )}

            {answer.solution && (
                <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Solution</span>
                    <p className="text-[13px] text-slate-600 leading-relaxed">{answer.solution}</p>
                </div>
            )}
        </div>
    );
}
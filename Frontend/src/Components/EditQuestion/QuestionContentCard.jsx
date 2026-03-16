// Components/EditQuestion/QuestionContentCard.jsx

export default function QuestionContentCard({
    currentStatement,
    currentDiagramUrl,
    incomingStatement,
    incomingDiagramImage,
    selectedStatement,
    setSelectedStatement,
    selectedDiagram,
    setSelectedDiagram,
}) {
    const incomingDiagramPreview = incomingDiagramImage
        ? URL.createObjectURL(incomingDiagramImage)
        : null;

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm shadow-slate-100 border border-slate-100 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                <span className="text-blue-500 text-lg mt-0.5">📝</span>
                <div>
                    <h2 className="text-[14.5px] font-semibold text-slate-800 tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                        Question Content
                    </h2>
                    <p className="text-[12px] text-slate-400 mt-0.5">Choose which version to keep.</p>
                </div>
            </div>

            {/* Statement comparison */}
            <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Statement</label>
                <div className="flex flex-col gap-2">
                    {/* Current */}
                    <button
                        type="button"
                        onClick={() => setSelectedStatement("current")}
                        className={`w-full text-left p-3 rounded-xl border-2 text-[13px] text-slate-600 leading-relaxed transition-all
                            ${selectedStatement === "current"
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-200 bg-slate-50"
                            }`}
                    >
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                            Current (A)
                        </span>
                        {currentStatement || "No statement available"}
                    </button>

                    {/* Incoming */}
                    {incomingStatement && (
                        <button
                            type="button"
                            onClick={() => setSelectedStatement("incoming")}
                            className={`w-full text-left p-3 rounded-xl border-2 text-[13px] text-slate-600 leading-relaxed transition-all
                                ${selectedStatement === "incoming"
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-slate-200 bg-slate-50"
                                }`}
                        >
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                                Incoming (E)
                            </span>
                            {incomingStatement}
                        </button>
                    )}
                </div>
            </div>

            {/* Diagram comparison */}
            <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Diagram</label>
                <div className="flex gap-2">
                    {/* Current */}
                    {currentDiagramUrl && (
                        <button
                            type="button"
                            onClick={() => setSelectedDiagram("current")}
                            className={`flex-1 rounded-xl border-2 overflow-hidden transition-all
                                ${selectedDiagram === "current"
                                    ? "border-blue-500"
                                    : "border-slate-200"
                                }`}
                        >
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block p-2">
                                Current (A)
                            </span>
                            <img src={currentDiagramUrl} alt="Current diagram" className="w-full object-cover" />
                        </button>
                    )}

                    {/* Incoming */}
                    {incomingDiagramPreview && (
                        <button
                            type="button"
                            onClick={() => setSelectedDiagram("incoming")}
                            className={`flex-1 rounded-xl border-2 overflow-hidden transition-all
                                ${selectedDiagram === "incoming"
                                    ? "border-blue-500"
                                    : "border-slate-200"
                                }`}
                        >
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block p-2">
                                Incoming (E)
                            </span>
                            <img src={incomingDiagramPreview} alt="Incoming diagram" className="w-full object-cover" />
                        </button>
                    )}

                    {/* No diagrams */}
                    {!currentDiagramUrl && !incomingDiagramPreview && (
                        <p className="text-[12px] text-slate-400">No diagrams available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
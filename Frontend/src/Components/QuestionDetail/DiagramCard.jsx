export default function DiagramCard({ diagramImage }) {
    if (!diagramImage) return null;
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">Diagram</p>
            <img
                src={diagramImage}
                alt="Question diagram"
                className="w-full rounded-xl object-contain"
            />
        </div>
    );
}
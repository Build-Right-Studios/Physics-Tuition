export default function AppearancesCard({ appearances }) {
    if (!appearances?.length) return null;
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Appearances</p>
            {appearances.map((a, i) => (
                <div key={i} className="flex justify-between items-center">
                    <span className="text-[13px] text-slate-700 font-medium">{a.exam}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-[12px] text-slate-400">{a.year}</span>
                        {a.valuesChanged && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                                Values Changed
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
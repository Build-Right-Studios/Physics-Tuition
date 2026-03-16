export default function QuestionHeader({ onBack, onEdit, onDelete, deleting }) {
    return (
        <div className="bg-white border-b border-slate-100 sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button
                    onClick={onBack}
                    className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                </button>
                <h1 className="text-[15px] font-bold text-slate-800" style={{ fontFamily: "'Sora', sans-serif" }}>
                    Question Detail
                </h1>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={onEdit}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 text-[12px] font-semibold hover:bg-blue-100 transition-all"
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                </button>
                <button
                    onClick={onDelete}
                    disabled={deleting}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-500 text-[12px] font-semibold hover:bg-red-100 transition-all disabled:opacity-50"
                >
                    {deleting ? (
                        <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                    ) : (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                    )}
                    Delete
                </button>
            </div>
        </div>
    );
}
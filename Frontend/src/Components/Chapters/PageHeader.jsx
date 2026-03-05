// Components/AddStudent/PageHeader.jsx

export default function PageHeader({ onBack }) {
    return (
        <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-slate-100 sticky top-0 z-10">
            <button
                onClick={onBack}
                aria-label="Go back"
                className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-all duration-150 flex-shrink-0"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
            </button>
            <span className="font-semibold text-[17px] text-slate-900 tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                Add a new Chapter
            </span>
        </div>
    );
}
// Components/AddQuestion/PageHeader.jsx

export default function PageHeader({ onBack }) {
    return (
        <div className="flex items-center justify-between px-4 pt-5 pb-3">
            <div className="flex items-center gap-3">
                <button
                    onClick={onBack}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <div>
                    <h1
                        className="text-[17px] font-bold text-slate-800 tracking-tight leading-tight"
                        style={{ fontFamily: "'Sora', sans-serif" }}
                    >
                        Add Question
                    </h1>
                    <p className="text-[11px] text-slate-400 mt-0.5">JEE/NEET Admin Portal</p>
                </div>
            </div>
            <span className="text-blue-500 text-xl">📘</span>
        </div>
    );
}
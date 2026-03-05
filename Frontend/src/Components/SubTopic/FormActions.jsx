// Components/SubTopic/FormActions.jsx

export default function FormActions({ loading, onSubmit, onCancel }) {
    return (
        <div className="flex flex-col gap-3 pt-1">
            <button
                type="button"
                onClick={onSubmit}
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-[15px] tracking-tight shadow-lg shadow-blue-200 transition-all duration-150"
                style={{ fontFamily: "'Sora', sans-serif" }}
            >
                {loading ? (
                    <span className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                )}
                {loading ? "Creating..." : "Create Subtopic"}
            </button>

            <button
                type="button"
                onClick={onCancel}
                className="text-slate-400 hover:text-slate-700 text-sm font-medium py-2 transition-colors duration-150 text-center w-full"
            >
                Cancel &amp; Go Back
            </button>
        </div>
    );
}
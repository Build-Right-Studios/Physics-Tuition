// Components/AddQuestion/CheckSimilarityButton.jsx

export default function CheckSimilarityButton({ loading, onCheck }) {
    return (
        <button
            onClick={onCheck}
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white
                bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all duration-150
                disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2
                shadow-sm shadow-blue-200 mb-4"
        >
            {loading ? (
                <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Checking...
                </>
            ) : (
                <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    Check Similarity
                </>
            )}
        </button>
    );
}
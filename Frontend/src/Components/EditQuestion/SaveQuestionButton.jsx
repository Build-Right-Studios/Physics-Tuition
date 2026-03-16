// Components/EditQuestion/SaveQuestionButton.jsx

export default function SaveQuestionButton({ loading, onSave }) {
    return (
        <button
            onClick={onSave}
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
                    Saving...
                </>
            ) : (
                <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                        <polyline points="17 21 17 13 7 13 7 21" />
                        <polyline points="7 3 7 8 15 8" />
                    </svg>
                    Save Changes
                </>
            )}
        </button>
    );
}
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE, CHAPTERS, SUBTOPICS, QUESTIONS } from "../Constants/apiRoutes.js";

import FilterBar    from "../Components/Questions/FilterBar.jsx";
import QuestionCard from "../Components/Questions/QuestionCard.jsx";

const BASE_URL = BASE.ROUTE;

const EXAM_TO_SOURCE = {
    "jee-mains":      "jee_mains",
    "jee-advanced":   "jee_advanced",
    "neet":           "neet",
    "cbse":           "cbse_board",
    "ncert":          "ncert",
    "ncert-exemplar": "ncert_exemplar",
};

const EXAM_LABELS = {
    "jee-mains":      "JEE Mains",
    "jee-advanced":   "JEE Advanced",
    "neet":           "NEET",
    "cbse":           "CBSE",
    "ncert":          "NCERT",
    "ncert-exemplar": "NCERT Exemplar",
};

export default function QuestionsPage() {
    const { exam }  = useParams();
    const navigate  = useNavigate();
    const source    = EXAM_TO_SOURCE[exam] || exam;
    const examLabel = EXAM_LABELS[exam]    || exam;

    const [questions, setQuestions] = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [total,     setTotal]     = useState(0);
    const [page,      setPage]      = useState(1);
    const [chapters,  setChapters]  = useState([]);
    const [subTopics, setSubTopics] = useState([]);
    const [filters,   setFilters]   = useState({
        exam: "", grade: "", chapter: "", subtopic: "", difficulty: "",
    });

    const setFilter = (field) => (value) => {
        if (field === "chapter") {
            setFilters(prev => ({ ...prev, chapter: value, subtopic: "" }));
        } else {
            setFilters(prev => ({ ...prev, [field]: value }));
        }
        setPage(1);
    };

    useEffect(() => {
        if (!filters.grade) { setChapters([]); return; }
        axios.get(`${BASE_URL}${CHAPTERS.GET}`, {
            params: { grade: filters.grade, subject: "Physics" }
        }).then(res => {
            if (res.data.success) setChapters(res.data.data);
        }).catch(() => {});
    }, [filters.grade]);

    useEffect(() => {
        if (!filters.chapter) { setSubTopics([]); return; }
        axios.get(`${BASE_URL}${SUBTOPICS.GET}`, {
            params: { chapterName: filters.chapter }
        }).then(res => {
            if (res.data.success) setSubTopics(res.data.data);
        }).catch(() => {});
    }, [filters.chapter]);

    const fetchQuestions = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}${QUESTIONS.GET}`, {
                params: {
                    source,
                    exam:       filters.exam,
                    grade:      filters.grade,
                    chapter:    filters.chapter,
                    subtopic:   filters.subtopic,
                    difficulty: filters.difficulty,
                    page,
                    limit: 20,
                },
            });
            if (res.data.success) {
                console.log("Questions data:", res.data);
                setQuestions(res.data.data);
                setTotal(res.data.total);
            }
        } catch {
        } finally {
            setLoading(false);
        }
    }, [source, filters, page]);

    useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

    const totalPages = Math.ceil(total / 20);

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Sticky Header */}
            <div className="bg-white border-b border-slate-100 sticky top-0 z-40">
                <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="p-2 rounded-xl hover:bg-slate-100 transition-colors flex-shrink-0"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 5l-7 7 7 7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-[15px] font-bold text-slate-800" style={{ fontFamily: "'Sora', sans-serif" }}>
                            {examLabel}
                        </h1>
                        <p className="text-[11px] text-slate-400">{total} questions</p>
                    </div>
                </div>

                {/* Filter bar inside header */}
                <div className="max-w-lg mx-auto px-4 pb-3">
                    <FilterBar
                        filters={filters}
                        setFilter={setFilter}
                        chapters={chapters}
                        subTopics={subTopics}
                    />
                </div>
            </div>

            {/* Questions List */}
            <div className="max-w-lg mx-auto px-4 py-4 flex flex-col gap-3">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <svg className="animate-spin text-blue-500" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                    </div>
                ) : questions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-2">
                        <span className="text-4xl">📭</span>
                        <p className="text-[13px] text-slate-400 font-medium">No questions found</p>
                        <p className="text-[12px] text-slate-300">Try adjusting your filters</p>
                    </div>
                ) : (
                    questions.map(q => (
                        <QuestionCard
                            key={q._id}
                            question={q}
                            onClick={(q) => navigate(`/questions/detail/${q.qdrantId}`, { state: { question: q } })}
                        />
                    ))
                )}

                {!loading && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 py-4">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 rounded-xl border border-slate-200 text-[12px] font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-all"
                        >
                            ← Prev
                        </button>
                        <span className="text-[12px] text-slate-400">
                            {page} / {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 rounded-xl border border-slate-200 text-[12px] font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-all"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
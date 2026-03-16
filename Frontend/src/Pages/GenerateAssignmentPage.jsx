import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE, CHAPTERS, SUBTOPICS, QUESTIONS, STUDENTS, ASSIGNMENTS } from "../Constants/apiRoutes.js";

import FilterStep         from "../Components/Assignment/FilterStep.jsx";
import QuestionSelectStep from "../Components/Assignment/QuestionSelectStep.jsx";
import StudentSelectStep  from "../Components/Assignment/StudentSelectStep.jsx";

const BASE_URL = BASE.ROUTE;

export default function GenerateAssignmentPage() {
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        grade: "", subject: "", chapter: "", subtopic: "", difficulty: "",
    });

    const [chapters,  setChapters]  = useState([]);
    const [subTopics, setSubTopics] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [students,  setStudents]  = useState([]);

    const [selectedIds,        setSelectedIds]        = useState([]);
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const [gradeFilter,        setGradeFilter]        = useState("");
    const [generating,         setGenerating]         = useState(false);
    const [loadingQuestions,   setLoadingQuestions]   = useState(false);

    const setFilter = (field) => (value) => {
        if (field === "chapter") {
            setFilters(prev => ({ ...prev, chapter: value, subtopic: "" }));
            setQuestions([]);
            setSelectedIds([]);
        } else {
            setFilters(prev => ({ ...prev, [field]: value }));
        }
    };

    useEffect(() => {
        if (!filters.grade || !filters.subject) { setChapters([]); return; }
        axios.get(`${BASE_URL}${CHAPTERS.GET}`, {
            params: { grade: filters.grade, subject: filters.subject }
        }).then(res => {
            if (res.data.success) setChapters(res.data.data);
        }).catch(() => {});
    }, [filters.grade, filters.subject]);

    useEffect(() => {
        if (!filters.chapter) { setSubTopics([]); return; }
        axios.get(`${BASE_URL}${SUBTOPICS.GET}`, {
            params: { chapterName: filters.chapter }
        }).then(res => {
            if (res.data.success) setSubTopics(res.data.data);
        }).catch(() => {});
    }, [filters.chapter]);

    useEffect(() => {
        if (!filters.chapter) { setQuestions([]); return; }
        setLoadingQuestions(true);
        axios.get(`${BASE_URL}${QUESTIONS.GET}`, {
            params: {
                grade:      filters.grade,
                chapter:    filters.chapter,
                subtopic:   filters.subtopic,
                difficulty: filters.difficulty,
                limit:      100,
            },
        }).then(res => {
            if (res.data.success) setQuestions(res.data.data);
        }).catch(() => {}).finally(() => setLoadingQuestions(false));
    }, [filters.chapter, filters.subtopic, filters.difficulty]);

    useEffect(() => {
        axios.get(`${BASE_URL}${STUDENTS.GET}`)
            .then(res => { if (res.data.success) setStudents(res.data.data); })
            .catch(() => {});
    }, []);

    const toggleQuestion = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleStudent = (id) => {
        setSelectedStudentIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleGenerate = async () => {
        if (!selectedIds.length)        return toast.error("Please select at least one question.");
        if (!selectedStudentIds.length) return toast.error("Please select at least one student.");

        try {
            setGenerating(true);

            const selectedQuestions = questions.filter(q => selectedIds.includes(q._id));
            const selectedStudents  = students.filter(s => selectedStudentIds.includes(s._id));

            // Generate PDF
            const res = await axios.post(`${BASE_URL}${ASSIGNMENTS.GENERATE}`, {
                questions:  selectedQuestions,
                grade:      filters.grade,
                subject:    filters.subject,
                chapter:    filters.chapter,
                difficulty: filters.difficulty || "Mixed",
                title:      `${filters.chapter} Assignment`,
            });

            if (!res.data.success) throw new Error("Failed to generate PDF");

            const pdfUrl = res.data.data.pdfUrl;

            // Compute expiry date — 7 days from now
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 7);
            const expiryStr = expiryDate.toLocaleDateString("en-IN", {
                day: "2-digit", month: "long", year: "numeric"
            });

            // Open WhatsApp for each student
            for (const student of selectedStudents) {
                const phone   = student.phone.replace("+", "");
                const message = encodeURIComponent(
                    `Hi ${student.name}! \n\n` +
                    `Your assignment is ready.\n\n` +
                    `${filters.chapter} Assignment\n` +
                    `Class ${filters.grade} | ${filters.subject}\n\n` +
                    `Download here: ${pdfUrl}\n\n` +
                    `Link expires on ${expiryStr}. Please download before then.\n\n` +
                    `— QuestionDesk`
                );

                console.log("Opening WhatsApp URL for:", student.name, student.phone);
                window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

                await new Promise(r => setTimeout(r, 800));
            }

            toast.success(`Assignment sent to ${selectedStudents.length} student${selectedStudents.length > 1 ? "s" : ""}!`);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to generate assignment.");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-slate-100">
                <div className="max-w-lg mx-auto flex flex-col">

                    {/* Header */}
                    <div className="bg-white border-b border-slate-100 sticky top-0 z-40 px-4 py-3 flex items-center gap-3">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 5l-7 7 7 7" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-[15px] font-bold text-slate-800" style={{ fontFamily: "'Sora', sans-serif" }}>
                                Generate Assignment
                            </h1>
                            <p className="text-[11px] text-slate-400">Select questions and send to students</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3.5 px-4 py-4">

                        {/* Step 1 — Filters */}
                        <FilterStep
                            filters={filters}
                            setFilter={setFilter}
                            chapters={chapters}
                            subTopics={subTopics}
                        />

                        {/* Step 2 — Questions */}
                        {loadingQuestions ? (
                            <div className="flex items-center justify-center py-10">
                                <svg className="animate-spin text-blue-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                </svg>
                            </div>
                        ) : (
                            <QuestionSelectStep
                                questions={questions}
                                selectedIds={selectedIds}
                                toggleQuestion={toggleQuestion}
                                selectAll={() => setSelectedIds(questions.map(q => q._id))}
                                clearAll={() => setSelectedIds([])}
                            />
                        )}

                        {/* Step 3 — Students */}
                        <StudentSelectStep
                            students={students}
                            selectedStudentIds={selectedStudentIds}
                            toggleStudent={toggleStudent}
                            selectAll={() => setSelectedStudentIds(students.map(s => s._id))}
                            clearAll={() => setSelectedStudentIds([])}
                            gradeFilter={gradeFilter}
                            setGradeFilter={setGradeFilter}
                        />

                        {/* Generate Button — always visible */}
                        <button
                            onClick={handleGenerate}
                            disabled={generating || selectedIds.length === 0 || selectedStudentIds.length === 0}
                            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white
                                bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all duration-150
                                disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2
                                shadow-sm shadow-blue-200 mb-4"
                        >
                            {generating ? (
                                <>
                                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                    </svg>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                    Generate & Send
                                    {selectedStudentIds.length > 0 && ` to ${selectedStudentIds.length} Student${selectedStudentIds.length > 1 ? "s" : ""}`}
                                </>
                            )}
                        </button>

                    </div>
                </div>
            </div>

            <ToastContainer
                position="bottom-center"
                autoClose={3000}
                hideProgressBar
                closeOnClick
                pauseOnHover
                toastStyle={{
                    borderRadius: "12px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px",
                }}
            />
        </>
    );
}
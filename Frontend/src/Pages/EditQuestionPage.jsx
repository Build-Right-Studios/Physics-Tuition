// Pages/EditQuestionPage.jsx

import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE, QUESTIONS, CHAPTERS, SUBTOPICS } from "../Constants/apiRoutes.js";

import EditPageHeader from "../Components/EditQuestion/EditPageHeader";
import ClassificationCard from "../Components/AddQuestion/ClassificationCard";
import AppearancesCard from "../Components/AddQuestion/AppearancesCard";
import SaveQuestionButton from "../Components/EditQuestion/SaveQuestionButton";
import QuestionContentCard from "../Components/EditQuestion/QuestionContentCard.jsx";
import AnswerCard from "../Components/AddQuestion/AnswerCard.jsx";

const BASE_URL = BASE.ROUTE;

export default function EditQuestionPage() {
    const navigate  = useNavigate();
    const { id }    = useParams();
    const { state } = useLocation();

    const incomingStatement    = state?.incomingStatement    || null;
    const incomingDiagramImage = state?.incomingDiagramImage || null;

    const [question,          setQuestion]          = useState(null);
    const [form,              setForm]              = useState({
        grade:       "",
        subject:     "",
        chapter:     "",
        subTopic:    "",
        difficulty:  "",
        tags:        [],
        specialNote: "",
        appearances: [],
    });

    const [chapters,          setChapters]          = useState([]);
    const [subTopics,         setSubTopics]         = useState([]);
    const [fetching,          setFetching]          = useState(true);
    const [loading,           setLoading]           = useState(false);
    const [selectedStatement, setSelectedStatement] = useState("current");
    const [selectedDiagram,   setSelectedDiagram]   = useState("current");
    const [answer,            setAnswer]            = useState(null);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                setFetching(true);
                const res = await axios.get(`${BASE_URL}${QUESTIONS.GET_BY_QID(id)}`);

                if (res.data.success) {
                    const q = res.data.data;
                    setQuestion(q);
                    setForm({
                        grade:       q.grade          || "",
                        subject:     q.subject        || "",
                        chapter:     q.chapter?.name  || "",
                        subTopic:    q.subTopic?.name || "",
                        difficulty:  q.difficulty     || "",
                        tags:        q.tags           || [],
                        specialNote: q.specialNote    || "",
                        appearances: q.appearances    || [],
                    });

                    // Pre-fill answer from existing question
                    if (q.answer) {
                        setAnswer({
                            type:     q.answer.type    || "mcq",
                            correct:  q.answer.correct || "",
                            solution: q.answer.solution || "",
                            options:  q.answer.options?.map(o => ({
                                label:        o.label,
                                text:         o.text         || "",
                                imageUrl:     o.imageUrl     || null,
                                imageFile:    null,
                                imagePreview: o.imageUrl     || null,
                            })) || [],
                        });
                    }

                    if (q.grade && q.subject) await fetchChapters(q.grade, q.subject);
                    if (q.chapter?.name)      await fetchSubTopics(q.chapter.name);
                }
            } catch (err) {
                toast.error("Failed to fetch question.");
                navigate("/dashboard");
            } finally {
                setFetching(false);
            }
        };

        fetchQuestion();
    }, [id]);

    const setField = (field) => (value) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const fetchChapters = async (grade, subject) => {
        if (!grade || !subject) return;
        try {
            const res = await axios.get(`${BASE_URL}${CHAPTERS.GET}`, { params: { grade, subject } });
            if (res.data.success) setChapters(res.data.data);
        } catch { toast.error("Failed to fetch chapters"); }
    };

    const fetchSubTopics = async (chapterName) => {
        if (!chapterName) return;
        try {
            const res = await axios.get(`${BASE_URL}${SUBTOPICS.GET}`, { params: { chapterName } });
            if (res.data.success) setSubTopics(res.data.data);
        } catch { toast.error("Failed to fetch subtopics"); }
    };

    const handleSave = async () => {
        if (!form.difficulty)       return toast.error("Please select difficulty");
        if (form.tags.length === 0) return toast.error("Please select at least one exam tag");

        try {
            setLoading(true);

            const finalStatement = selectedStatement === "incoming"
                ? incomingStatement
                : question?.statement;

            const payload = new FormData();
            payload.append("grade",       form.grade);
            payload.append("subject",     form.subject);
            payload.append("chapter",     form.chapter);
            payload.append("subTopic",    form.subTopic);
            payload.append("difficulty",  form.difficulty);
            payload.append("tags",        JSON.stringify(form.tags));
            payload.append("appearances", JSON.stringify(form.appearances));
            payload.append("specialNote", form.specialNote);
            payload.append("statement",   finalStatement);

            if (selectedDiagram === "incoming" && incomingDiagramImage) {
                payload.append("diagramImage", incomingDiagramImage);
            }

            // Append answer
            if (answer) {
                const answerToSave = {
                    ...answer,
                    options: answer.options?.map(({ label, text, imageUrl }) => ({
                        label, text, imageUrl: imageUrl || "",
                    })),
                };
                payload.append("answer", JSON.stringify(answerToSave));

                // Append new option image files if uploaded
                answer.options?.forEach(option => {
                    if (option.imageFile) {
                        payload.append(`optionImage_${option.label}`, option.imageFile);
                    }
                });
            }

            const res = await axios.patch(
                `${BASE_URL}${QUESTIONS.UPDATE(question?._id)}`,
                payload,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (res.data.success) {
                toast.success("Question updated successfully!");
                setTimeout(() => navigate("/dashboard"), 1500);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update question");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <svg className="animate-spin text-blue-500" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    <p className="text-[13px] text-slate-400 font-medium">Loading question...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-slate-100 flex flex-col items-center sm:justify-center sm:py-8">
                <div className="w-full max-w-[430px] bg-slate-100 min-h-screen sm:min-h-0 sm:rounded-3xl sm:overflow-hidden sm:shadow-2xl sm:shadow-slate-300/60 flex flex-col">

                    <EditPageHeader onBack={() => navigate(-1)} />

                    <div className="flex flex-col gap-3.5 px-4 py-4 flex-1">

                        <ClassificationCard
                            form={form}
                            setField={setField}
                            chapters={chapters}
                            subTopics={subTopics}
                            onGradeSubjectChange={fetchChapters}
                            onChapterChange={fetchSubTopics}
                        />

                        <QuestionContentCard
                            currentStatement={question?.statement}
                            currentDiagramUrl={question?.diagramImage}
                            incomingStatement={incomingStatement}
                            incomingDiagramImage={incomingDiagramImage}
                            selectedStatement={selectedStatement}
                            setSelectedStatement={setSelectedStatement}
                            selectedDiagram={selectedDiagram}
                            setSelectedDiagram={setSelectedDiagram}
                        />

                        <AppearancesCard
                            appearances={form.appearances}
                            setAppearances={setField("appearances")}
                        />

                        {/* Answer Card — pre-filled from existing question */}
                        <AnswerCard answer={answer} setAnswer={setAnswer} />

                        <SaveQuestionButton loading={loading} onSave={handleSave} />

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
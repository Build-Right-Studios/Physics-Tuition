// Pages/AddQuestionPage.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE, CHAPTERS, SUBTOPICS, RAG, QUESTIONS } from "../Constants/apiRoutes.js";

import PageHeader from "../Components/AddQuestion/PageHeader";
import ClassificationCard from "../Components/AddQuestion/ClassificationCard";
import QuestionMediaCard from "../Components/AddQuestion/QuestionMediaCard";
import AppearancesCard from "../Components/AddQuestion/AppearancesCard";
import CheckSimilarityButton from "../Components/AddQuestion/CheckSimilarityButton";

const BASE_URL = BASE.ROUTE;
const RAG_URL = RAG.BASE;

const initialForm = {
    grade: "",
    subject: "",
    chapter: "",
    subTopic: "",
    difficulty: "",
    tags: [],
    specialNote: "",
    appearances: [],
};

const TAG_TO_SOURCE = {
    "NEET":          "neet",
    "JEE Main":      "jee_mains",
    "JEE Advanced":  "jee_advanced",
    "CBSE Board":    "cbse_board",
    "NCERT":         "ncert",
    "NCERT Exemplar":"ncert_exemplar",
};

export default function AddQuestionPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState(initialForm);
    const [chapters, setChapters] = useState([]);
    const [subTopics, setSubTopics] = useState([]);
    const [textImage, setTextImage] = useState(null);
    const [diagramImage, setDiagramImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const setField = (field) => (value) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const fetchChapters = async (grade, subject) => {
        if (!grade || !subject) return;
        try {
            const res = await axios.get(`${BASE_URL}${CHAPTERS.GET}`, {
                params: { grade, subject },
            });
            if (res.data.success) setChapters(res.data.data);
        } catch {
            toast.error("Failed to fetch chapters");
        }
    };

    const fetchSubTopics = async (chapterName) => {
        if (!chapterName) return;
        try {
            const res = await axios.get(`${BASE_URL}${SUBTOPICS.GET}`, {
                params: { chapterName },
            });
            if (res.data.success) setSubTopics(res.data.data);
        } catch {
            toast.error("Failed to fetch subtopics");
        }
    };

    const handleCheckSimilarity = async () => {
        if (!form.grade) return toast.error("Please select a class");
        if (!form.subject) return toast.error("Please select a subject");
        if (!form.chapter) return toast.error("Please select a chapter");
        if (!form.subTopic) return toast.error("Please select a subtopic");
        if (!form.difficulty) return toast.error("Please select difficulty");
        if (form.tags.length === 0) return toast.error("Please select at least one exam tag");
        if (!textImage) return toast.error("Please upload the question text photo");

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("text_image", textImage);
            if (diagramImage) formData.append("diagram_image", diagramImage);
            formData.append("source", TAG_TO_SOURCE[form.tags[0]]);
            formData.append("subject", form.subject.toLowerCase());
            formData.append("class", form.grade);
            formData.append("chapter", form.chapter);
            formData.append("subtopic", form.subTopic);
            formData.append("difficulty", form.difficulty);
            formData.append("exam_tags", form.tags.map(tag => TAG_TO_SOURCE[tag]).join(","));
            formData.append("appearances", JSON.stringify(form.appearances));
            formData.append("top_k", 10);
            console.log("Exam tags", form.tags.map(tag => TAG_TO_SOURCE[tag]).join(","));
            

            const res = await axios.post(`${RAG_URL}${QUESTIONS.CHECK_SIMILARITY}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log(res.data.processed_question.text);

            navigate("/questions/similarity-result", {
                state: {
                    formData: form,
                    extractedText: res.data.processed_question.text,
                    processedQuestion: res.data.processed_question, 
                    diagramImage,
                    matches: res.data.matches,
                    matchCount: res.data.match_count,
                },
            });
        } catch (error) {
            console.log("Full error:", error.response?.data);
            toast.error("Similarity check failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-slate-100 flex flex-col items-center sm:justify-center sm:py-8">
                <div className="w-full max-w-[430px] bg-slate-100 min-h-screen sm:min-h-0 sm:rounded-3xl sm:overflow-hidden sm:shadow-2xl sm:shadow-slate-300/60 flex flex-col">

                    <PageHeader onBack={() => navigate(-1)} />

                    <div className="flex flex-col gap-3.5 px-4 py-4 flex-1">
                        <ClassificationCard
                            form={form}
                            setField={setField}
                            chapters={chapters}
                            subTopics={subTopics}
                            onGradeSubjectChange={fetchChapters}
                            onChapterChange={fetchSubTopics}
                        />

                        <QuestionMediaCard
                            textImage={textImage}
                            setTextImage={setTextImage}
                            diagramImage={diagramImage}
                            setDiagramImage={setDiagramImage}
                            specialNote={form.specialNote}
                            setSpecialNote={setField("specialNote")}
                        />

                        <AppearancesCard
                            appearances={form.appearances}
                            setAppearances={setField("appearances")}
                        />

                        <CheckSimilarityButton
                            loading={loading}
                            onCheck={handleCheckSimilarity}
                        />
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
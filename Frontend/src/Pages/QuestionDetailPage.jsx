import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE, QUESTIONS, RAG } from "../Constants/apiRoutes.js";
import { TAG_TO_SOURCE } from "../Pages/SimilarityResultPage.jsx";

import QuestionHeader      from "../Components/QuestionDetail/QuestionHeader.jsx";
import StatementCard       from "../Components/QuestionDetail/StatementCard.jsx";
import DiagramCard         from "../Components/QuestionDetail/DiagramCard.jsx";
import ClassificationCard  from "../Components/QuestionDetail/ClassificationCard.jsx";
import AppearancesCard     from "../Components/QuestionDetail/AppearancesCard.jsx";
import AnswerCard          from "../Components/QuestionDetail/AnswerCard.jsx";
import SpecialNoteCard     from "../Components/QuestionDetail/SpecialNoteCard.jsx";

const BASE_URL = BASE.ROUTE;
const RAG_URL  = RAG.BASE;

export default function QuestionDetailPage() {
    const { id }     = useParams();
    const navigate   = useNavigate();
    const { state }  = useLocation();
    const question   = state?.question;
    const [deleting, setDeleting] = useState(false);

    if (!question) {
        navigate(-1);
        return null;
    }

    const handleEdit = () => {
        navigate(`/questions/edit/${question.qdrantId}`, {
            state: { question },
        });
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this question?")) return;

        try {
            setDeleting(true);

            const source  = TAG_TO_SOURCE[question.tags?.[0]] || "neet";
            const subject = question.subject?.toLowerCase();

            // Step 1 — Delete from MongoDB
            await axios.delete(`${BASE_URL}${QUESTIONS.DELETE(question._id)}`);

            // Step 2 — Delete from Qdrant via RAG
            await axios.delete(`${RAG_URL}${RAG.DELETE_QUESTION(question.qdrantId)}`, {
                params: { source, subject },
            });

            toast.success("Question deleted!");
            setTimeout(() => navigate(-1), 1500);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete question.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-slate-100">
                <div className="max-w-lg mx-auto flex flex-col">

                    <QuestionHeader
                        onBack={() => navigate(-1)}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        deleting={deleting}
                    />

                    <div className="flex flex-col gap-3.5 px-4 py-4">
                        <StatementCard
                            statement={question.statement}
                            difficulty={question.difficulty}
                            qdrantId={question.qdrantId}
                        />
                        <DiagramCard diagramImage={question.diagramImage} />
                        <ClassificationCard
                            grade={question.grade}
                            subject={question.subject}
                            chapter={question.chapter}
                            subTopic={question.subTopic}
                            tags={question.tags}
                        />
                        <AppearancesCard appearances={question.appearances} />
                        <AnswerCard answer={question.answer} />
                        <SpecialNoteCard specialNote={question.specialNote} />
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
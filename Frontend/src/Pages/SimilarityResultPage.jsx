import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { BASE, QUESTIONS, RAG } from "../Constants/apiRoutes.js";

import ResultPageHeader from "../Components/AddQuestion/ResultPageHeader";
import NoMatchResult from "../Components/AddQuestion/NoMatchResult";
import MatchResult from "../Components/AddQuestion/MatchResult";

const BASE_URL = BASE.ROUTE;
const RAG_URL = RAG.BASE;
const SESSION_KEY = "similarityState";

export const TAG_TO_SOURCE = {
    "NEET": "neet",
    "JEE Main": "jee_mains",
    "JEE Advanced": "jee_advanced",
    "CBSE Board": "cbse_board",
    "NCERT": "ncert",
    "NCERT Exemplar": "ncert_exemplar",
};

export default function SimilarityResultPage() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [saving, setSaving] = useState(false);
    const [answer, setAnswer] = useState(null);

    useEffect(() => {
        if (state) {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify({
                formData: state.formData,
                extractedText: state.extractedText,
                processedQuestion: state.processedQuestion,
                matches: state.matches,
                matchCount: state.matchCount,
            }));
        }
    }, [state]);

    const resolvedState = state || (() => {
        const stored = sessionStorage.getItem(SESSION_KEY);
        return stored ? JSON.parse(stored) : null;
    })();

    if (!resolvedState) {
        navigate("/questions/add");
        return null;
    }

    const { formData, matches, matchCount, processedQuestion } = resolvedState;
    const extractedText = resolvedState?.extractedText || "";
    const diagramImage = state?.diagramImage || null;

    // Extract prefill options from processedQuestion
    const prefillOptions = processedQuestion?.options || null;

    const hasMatches = matchCount > 0 && matches?.some(m => m.similarity_score > 0.5);

    const handleSaveQuestion = async () => {
        try {
            setSaving(true);

            const qdrantRes = await axios.post(`${RAG_URL}/question`, {
                source: TAG_TO_SOURCE[formData.tags[0]],
                subject: formData.subject.toLowerCase(),
                question_data: processedQuestion,
                remove_duplicate_ids: [],
            });

            const payload = new FormData();
            payload.append("grade", formData.grade);
            payload.append("subject", formData.subject);
            payload.append("chapter", formData.chapter);
            payload.append("subTopic", formData.subTopic);
            payload.append("difficulty", formData.difficulty);
            payload.append("tags", JSON.stringify(formData.tags));
            payload.append("appearances", JSON.stringify(formData.appearances));
            payload.append("specialNote", formData.specialNote);
            payload.append("statement", extractedText);
            payload.append("qdrantId", qdrantRes.data.question_id);
            if (diagramImage) payload.append("diagramImage", diagramImage);

            if (answer) {
                const answerToSave = {
                    ...answer,
                    options: answer.options?.map(({ label, text, imageUrl }) => ({
                        label, text, imageUrl: imageUrl || "",
                    })),
                };
                payload.append("answer", JSON.stringify(answerToSave));
                answer.options?.forEach(option => {
                    if (option.imageFile) {
                        payload.append(`optionImage_${option.label}`, option.imageFile);
                    }
                });
            }

            const res = await axios.post(`${BASE_URL}${QUESTIONS.ADD}`, payload, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data.success) {
                toast.success("Question saved successfully!");
                sessionStorage.removeItem(SESSION_KEY);
                setTimeout(() => navigate("/dashboard"), 1500);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save question");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (q) => {
        navigate(`/questions/edit/${q.question_id}`, {
            state: {
                question: q,
                incomingStatement: extractedText,
                incomingDiagramImage: diagramImage,
            },
        });
    };

    return (
        <>
            <div className="min-h-screen bg-slate-100 flex flex-col items-center sm:justify-center sm:py-8">
                <div className="w-full max-w-[430px] bg-slate-100 min-h-screen sm:min-h-0 sm:rounded-3xl sm:overflow-hidden sm:shadow-2xl sm:shadow-slate-300/60 flex flex-col">

                    <ResultPageHeader onBack={() => navigate(-1)} />

                    <div className="flex flex-col gap-3.5 px-4 py-4 flex-1">
                        {!hasMatches ? (
                            <NoMatchResult
                                formData={formData}
                                saving={saving}
                                onSave={handleSaveQuestion}
                                answer={answer}
                                setAnswer={setAnswer}
                                prefillOptions={prefillOptions}
                            />
                        ) : (
                            <MatchResult
                                matches={matches}
                                saving={saving}
                                onSaveAnyway={handleSaveQuestion}
                                onEdit={handleEdit}
                                answer={answer}
                                setAnswer={setAnswer}
                                prefillOptions={prefillOptions}
                            />
                        )}
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
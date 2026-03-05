// Components/SubTopic/SubTopicForm.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE, CHAPTERS, SUBTOPICS } from "../../Constants/apiRoutes.js";

import GradeSelect from "./GradeSelect";
import SubjectSelect from "./SubjectSelect";
import ChapterSelect from "./ChapterSelect";
import SubTopicInput from "./SubTopicInput";
import FormActions from "./FormActions";

const BASE_URL = BASE.ROUTE;

const initialForm = {
    grade: "",
    subject: "",
    selectedChapter: "",
    subtopicName: "",
};

function SectionCard({ icon, title, desc, children }) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm shadow-slate-100 border border-slate-100 flex flex-col gap-4">
            <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                <span className="text-blue-500 text-lg mt-0.5 flex-shrink-0">{icon}</span>
                <div>
                    <h2
                        className="text-[14.5px] font-semibold text-slate-800 tracking-tight"
                        style={{ fontFamily: "'Sora', sans-serif" }}
                    >
                        {title}
                    </h2>
                    <p className="text-[12px] text-slate-400 mt-0.5">{desc}</p>
                </div>
            </div>
            {children}
        </div>
    );
}

export default function SubTopicForm({ onSuccess, onCancel }) {
    const [form, setForm] = useState(initialForm);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(false);

    const setField = (field) => (value) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    useEffect(() => {
        setForm((prev) => ({ ...prev, selectedChapter: "", subtopicName: "" }));
        setChapters([]);

        if (!form.grade || !form.subject) return;

        const controller = new AbortController();

        const fetchChapters = async () => {
            try {
                const res = await axios.get(`${BASE_URL}${CHAPTERS.GET}`, {
                    params: { grade: form.grade, subject: form.subject },
                    signal: controller.signal,
                });
                if (res.data.success) {
                    setChapters(res.data.data); // data is string[]
                }
            } catch (err) {
                if (!axios.isCancel(err)) toast.error("Failed to fetch chapters");
            }
        };

        fetchChapters();
        return () => controller.abort();
    }, [form.grade, form.subject]);

    const handleSubmit = async () => {
        const { grade, subject, selectedChapter, subtopicName } = form;

        if (!grade) return toast.error("Please select a class");
        if (!subject) return toast.error("Please select a subject");
        if (!selectedChapter) return toast.error("Please select a chapter");
        if (!subtopicName.trim()) return toast.error("Subtopic name is required");

        try {
            setLoading(true);
            const res = await axios.post(`${BASE_URL}${SUBTOPICS.ADD}`, {
                chapterName: selectedChapter, // ✅ was chapterId, chapters are strings not objects
                topicName: subtopicName.trim(),
            });

            if (res.data.success) {
                toast.success("Subtopic created successfully!");
                setForm(initialForm);
                setChapters([]);
                onSuccess?.();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create subtopic");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-3.5 px-4 py-4 flex-1">
            <SectionCard
                icon="✦"
                title="Add a new SubTopic"
                desc="Assign this subtopic to a parent chapter."
            >
                <GradeSelect grade={form.grade} setGrade={setField("grade")} />
                <SubjectSelect subject={form.subject} setSubject={setField("subject")} />
                <ChapterSelect
                    chapters={chapters}
                    selectedChapter={form.selectedChapter}
                    setSelectedChapter={setField("selectedChapter")}
                    disabled={!form.grade || !form.subject}
                />
            </SectionCard>

            <SectionCard
                icon="✎"
                title="Subtopic Details"
                desc="Name your subtopic clearly and concisely."
            >
                <SubTopicInput
                    subtopicName={form.subtopicName}
                    setSubtopicName={setField("subtopicName")}
                />
            </SectionCard>

            <FormActions
                loading={loading}
                onSubmit={handleSubmit}
                onCancel={onCancel}
            />
        </div>
    );
}
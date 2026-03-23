// Components/AddQuestion/AnswerCard.jsx

import { useRef, useEffect, useCallback, useState } from "react";
import { hasLatexSyntax } from "../../Constants/latex.js";
import LatexText from "../Layout/LatexText.jsx";

const LABELS = ["A", "B", "C", "D"];

export default function AnswerCard({ answer, setAnswer, prefillOptions }) {

    const fileRefs = {
        A: useRef(null),
        B: useRef(null),
        C: useRef(null),
        D: useRef(null),
    };

    const [editingLabels, setEditingLabels] = useState([]);

    const toggleEdit = (label) => {
        setEditingLabels(prev =>
            prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
        );
    };

    const stripLabel = useCallback((text) => {
        if (!text) return "";
        return text
            .replace(/^[A-Da-d]\s*[\.\)\:\-]\s*/i, "")
            .replace(/^[A-Da-d]\s+/i, "")
            .replace(/^\([A-Da-d]\)\s*/i, "")
            .trim();
    }, []);

    const applyPrefill = useCallback(() => {
        if (!prefillOptions?.has_options) return;
        setAnswer(prev => {
            if (!prev || prev.type !== "mcq") return prev;
            return {
                ...prev,
                options: prev.options.map(o => ({
                    ...o,
                    text:         stripLabel(prefillOptions[`option_${o.label.toLowerCase()}`] || ""),
                    imageFile:    null,
                    imagePreview: null,
                })),
            };
        });
    }, [prefillOptions, stripLabel]);

    useEffect(() => {
        if (!prefillOptions?.has_options) return;
        applyPrefill();
    }, [prefillOptions]);

    useEffect(() => {
        if (answer?.type !== "mcq") return;
        if (!prefillOptions?.has_options) return;
        if (answer.options?.some(o => o.text)) return;
        applyPrefill();
    }, [answer?.type]);

    const setType = (type) => {
        setEditingLabels([]);
        setAnswer({
            type,
            options: type === "mcq"
                ? LABELS.map(label => ({ label, text: "", imageFile: null, imagePreview: null }))
                : [],
            correct:  "",
            solution: "",
        });
    };

    const setOptionText = (label, text) => {
        setAnswer(prev => ({
            ...prev,
            options: prev.options.map(o =>
                o.label === label ? { ...o, text, imageFile: null, imagePreview: null } : o
            ),
        }));
    };

    const setOptionImage = (label, file) => {
        if (!file) return;
        const imagePreview = URL.createObjectURL(file);
        setAnswer(prev => ({
            ...prev,
            options: prev.options.map(o =>
                o.label === label ? { ...o, imageFile: file, imagePreview, text: "" } : o
            ),
        }));
    };

    const clearOptionImage = (label) => {
        setAnswer(prev => ({
            ...prev,
            options: prev.options.map(o =>
                o.label === label ? { ...o, imageFile: null, imagePreview: null } : o
            ),
        }));
    };

    const setCorrect   = (label) => setAnswer(prev => ({ ...prev, correct: label }));
    const setSolution  = (val)   => setAnswer(prev => ({ ...prev, solution: val }));
    const setNumerical = (val)   => setAnswer(prev => ({ ...prev, correct: val }));

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm shadow-slate-100 border border-slate-100 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                <span className="text-blue-500 text-lg mt-0.5">✏️</span>
                <div>
                    <h2 className="text-[14.5px] font-semibold text-slate-800 tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                        Answer
                    </h2>
                    <p className="text-[12px] text-slate-400 mt-0.5">Add the correct answer for this question.</p>
                </div>
            </div>

            {/* Type selector */}
            <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Answer Type</label>
                <div className="flex gap-2">
                    {["mcq", "numerical"].map(type => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setType(type)}
                            className={`flex-1 py-2 rounded-xl border-2 text-sm font-semibold transition-all duration-150
                                ${answer?.type === type
                                    ? "border-blue-500 bg-blue-50 text-blue-600"
                                    : "border-slate-200 bg-slate-50 text-slate-500"
                                }`}
                        >
                            {type === "mcq" ? "MCQ" : "Numerical"}
                        </button>
                    ))}
                </div>
            </div>

            {/* MCQ Options */}
            {answer?.type === "mcq" && (
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Options</label>
                        {prefillOptions?.has_options && (
                            <span className="text-[10px] font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-lg">
                                ✓ Auto-extracted from image
                            </span>
                        )}
                    </div>

                    {answer.options.map(option => {
                        const isEditing = editingLabels.includes(option.label);
                        const isLatex   = option.text && hasLatexSyntax(option.text);

                        return (
                            <div key={option.label} className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-[12px] font-bold text-slate-500 w-4">{option.label}</span>

                                    {!option.imagePreview && (
                                        <div className="flex-1 flex flex-col gap-1">
                                            {isLatex && !isEditing ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 min-h-[38px] flex items-center">
                                                        <LatexText text={option.text} />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleEdit(option.label)}
                                                        className="px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 hover:border-blue-300 hover:text-blue-400 transition-all flex-shrink-0"
                                                        title="Edit raw LaTeX"
                                                    >
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder={`Option ${option.label}`}
                                                        value={option.text}
                                                        onChange={e => setOptionText(option.label, e.target.value)}
                                                        autoFocus={isEditing}
                                                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-700 outline-none focus:border-blue-400 focus:bg-blue-50 transition-all"
                                                    />
                                                    {isEditing && (
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleEdit(option.label)}
                                                            className="px-2.5 py-2 rounded-xl border border-green-200 bg-green-50 text-green-600 text-[11px] font-semibold flex-shrink-0"
                                                        >
                                                            Done
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {option.imagePreview && (
                                        <div className="flex-1 relative">
                                            <img
                                                src={option.imagePreview}
                                                alt={`Option ${option.label}`}
                                                className="w-full h-16 object-contain rounded-xl border border-slate-200 bg-slate-50"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => clearOptionImage(option.label)}
                                                className="absolute top-1 right-1 bg-red-50 border border-red-200 text-red-500 rounded-lg px-1.5 py-0.5 text-[10px] font-semibold"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}

                                    {!option.imagePreview && !isEditing && (
                                        <>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                ref={fileRefs[option.label]}
                                                onChange={e => setOptionImage(option.label, e.target.files[0])}
                                                className="hidden"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => fileRefs[option.label].current.click()}
                                                className="px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 hover:border-blue-300 hover:text-blue-400 transition-all flex-shrink-0"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                                    <polyline points="21 15 16 10 5 21" />
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    <div className="flex flex-col gap-2 mt-1">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Correct Answer</label>
                        <div className="flex gap-2">
                            {LABELS.map(label => (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={() => setCorrect(label)}
                                    className={`flex-1 py-2 rounded-xl border-2 text-sm font-bold transition-all duration-150
                                        ${answer.correct === label
                                            ? "border-green-500 bg-green-50 text-green-600"
                                            : "border-slate-200 bg-slate-50 text-slate-500"
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {answer?.type === "numerical" && (
                <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Correct Answer</label>
                    <input
                        type="text"
                        placeholder="e.g. 42.5"
                        value={answer.correct}
                        onChange={e => setNumerical(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-700 outline-none focus:border-blue-400 focus:bg-blue-50 transition-all"
                    />
                </div>
            )}

            {answer?.type && (
                <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                        Solution <span className="text-slate-300 normal-case font-normal">(optional)</span>
                    </label>
                    <textarea
                        placeholder="Add step-by-step solution..."
                        value={answer.solution}
                        onChange={e => setSolution(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-700 outline-none focus:border-blue-400 focus:bg-blue-50 transition-all resize-none"
                    />
                </div>
            )}
        </div>
    );
}
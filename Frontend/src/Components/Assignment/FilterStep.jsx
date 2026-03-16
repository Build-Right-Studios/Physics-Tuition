import { useState } from "react";
import FilterPill from "../Questions/FilterPill.jsx";

const GRADES       = ["11", "12"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const SUBJECTS     = ["Physics", "Chemistry", "Maths", "Biology"];

export default function FilterStep({ filters, setFilter, chapters, subTopics }) {
    const [openDropdown, setOpenDropdown] = useState(null);

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4">
            <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                <span className="text-blue-500 text-lg mt-0.5">🔍</span>
                <div>
                    <h2 className="text-[14.5px] font-semibold text-slate-800 tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                        Filter Questions
                    </h2>
                    <p className="text-[12px] text-slate-400 mt-0.5">Select criteria to load questions.</p>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {/* Grade */}
                <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Class</label>
                    <div className="relative">
                        <select
                            value={filters.grade}
                            onChange={(e) => setFilter("grade")(e.target.value)}
                            className="w-full appearance-none pr-9 pl-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all
                                bg-slate-50 text-slate-700 border-slate-200 focus:border-blue-500 focus:bg-blue-50"
                        >
                            <option value="">Select Class</option>
                            {GRADES.map(g => <option key={g} value={g}>Class {g}</option>)}
                        </select>
                        <span className="pointer-events-none absolute right-3 top-3 text-slate-400">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                        </span>
                    </div>
                </div>

                {/* Subject */}
                <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Subject</label>
                    <div className="relative">
                        <select
                            value={filters.subject}
                            onChange={(e) => setFilter("subject")(e.target.value)}
                            className="w-full appearance-none pr-9 pl-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all
                                bg-slate-50 text-slate-700 border-slate-200 focus:border-blue-500 focus:bg-blue-50"
                        >
                            <option value="">Select Subject</option>
                            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <span className="pointer-events-none absolute right-3 top-3 text-slate-400">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                        </span>
                    </div>
                </div>

                {/* Chapter */}
                <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Chapter</label>
                    <div className="relative">
                        <select
                            value={filters.chapter}
                            onChange={(e) => setFilter("chapter")(e.target.value)}
                            disabled={!filters.grade || !filters.subject}
                            className="w-full appearance-none pr-9 pl-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all
                                bg-slate-50 text-slate-700 border-slate-200 focus:border-blue-500 focus:bg-blue-50
                                disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <option value="">{!filters.grade || !filters.subject ? "Select class & subject first" : "Select Chapter"}</option>
                            {chapters.map((ch, i) => <option key={i} value={ch}>{ch}</option>)}
                        </select>
                        <span className="pointer-events-none absolute right-3 top-3 text-slate-400">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                        </span>
                    </div>
                </div>

                {/* Subtopic */}
                <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                        Subtopic <span className="text-slate-300 normal-case font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                        <select
                            value={filters.subtopic}
                            onChange={(e) => setFilter("subtopic")(e.target.value)}
                            disabled={!filters.chapter}
                            className="w-full appearance-none pr-9 pl-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all
                                bg-slate-50 text-slate-700 border-slate-200 focus:border-blue-500 focus:bg-blue-50
                                disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <option value="">{!filters.chapter ? "Select chapter first" : "All Subtopics"}</option>
                            {subTopics.map((st, i) => <option key={i} value={st}>{st}</option>)}
                        </select>
                        <span className="pointer-events-none absolute right-3 top-3 text-slate-400">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                        </span>
                    </div>
                </div>

                {/* Difficulty */}
                <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                        Difficulty <span className="text-slate-300 normal-case font-normal">(optional)</span>
                    </label>
                    <div className="flex gap-2">
                        {DIFFICULTIES.map(d => (
                            <button
                                key={d}
                                type="button"
                                onClick={() => setFilter("difficulty")(filters.difficulty === d ? "" : d)}
                                className={`flex-1 py-2 rounded-xl border-2 text-sm font-semibold transition-all
                                    ${filters.difficulty === d
                                        ? d === "Easy"   ? "border-green-500 bg-green-50 text-green-600"
                                        : d === "Medium" ? "border-amber-500 bg-amber-50 text-amber-600"
                                        :                  "border-red-400 bg-red-50 text-red-500"
                                        : "border-slate-200 bg-slate-50 text-slate-500"
                                    }`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
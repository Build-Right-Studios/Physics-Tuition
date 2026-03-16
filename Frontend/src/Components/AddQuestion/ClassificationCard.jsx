// Components/AddQuestion/ClassificationCard.jsx

const GRADES = ["11", "12"];
const SUBJECTS = ["Physics", "Chemistry", "Maths"];
const DIFFICULTIES = [
    { label: "Easy", active: "border-green-500 bg-green-50 text-green-600", inactive: "border-slate-200 bg-slate-50 text-slate-500" },
    { label: "Medium", active: "border-amber-500 bg-amber-50 text-amber-600", inactive: "border-slate-200 bg-slate-50 text-slate-500" },
    { label: "Hard", active: "border-red-400   bg-red-50   text-red-500", inactive: "border-slate-200 bg-slate-50 text-slate-500" },
];
const TAGS = ["NEET", "JEE Main", "JEE Advanced", "CBSE Board", "NCERT", "NCERT Exemplar"];

export default function ClassificationCard({
    form, setField, chapters, subTopics, onGradeSubjectChange, onChapterChange,
}) {
    const handleGradeChange = (val) => {
        setField("grade")(val);
        setField("chapter")("");
        setField("subTopic")("");
        onGradeSubjectChange(val, form.subject);
    };

    const handleSubjectChange = (val) => {
        setField("subject")(val);
        setField("chapter")("");
        setField("subTopic")("");
        onGradeSubjectChange(form.grade, val);
    };

    const handleChapterChange = (val) => {
        setField("chapter")(val);
        setField("subTopic")("");
        onChapterChange(val);
    };

    const toggleTag = (tag) => {
        const current = form.tags;
        setField("tags")(
            current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag]
        );
    };

    const chevron = (
        <span className="pointer-events-none absolute right-3 text-slate-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
            </svg>
        </span>
    );

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm shadow-slate-100 border border-slate-100 flex flex-col gap-4">
            {/* Card Header */}
            <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                <span className="text-blue-500 text-lg mt-0.5 flex-shrink-0">✦</span>
                <div>
                    <h2 className="text-[14.5px] font-semibold text-slate-800 tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                        Classification
                    </h2>
                    <p className="text-[12px] text-slate-400 mt-0.5">Assign class, subject, chapter and difficulty.</p>
                </div>
            </div>

            {/* Class + Subject row */}
            <div className="flex gap-3">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Class</label>
                    <div className="relative flex items-center">
                        <select
                            value={form.grade}
                            onChange={(e) => handleGradeChange(e.target.value)}
                            className="w-full appearance-none pr-8 pl-3 py-2.5 rounded-xl border text-sm outline-none transition-all duration-150
                                bg-slate-50 text-slate-700 border-slate-200
                                focus:border-blue-500 focus:bg-blue-50 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">Select</option>
                            {GRADES.map((g) => <option key={g} value={g}>Class {g}</option>)}
                        </select>
                        {chevron}
                    </div>
                </div>

                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Subject</label>
                    <div className="relative flex items-center">
                        <select
                            value={form.subject}
                            onChange={(e) => handleSubjectChange(e.target.value)}
                            className="w-full appearance-none pr-8 pl-3 py-2.5 rounded-xl border text-sm outline-none transition-all duration-150
                                bg-slate-50 text-slate-700 border-slate-200
                                focus:border-blue-500 focus:bg-blue-50 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">Select</option>
                            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {chevron}
                    </div>
                </div>
            </div>

            {/* Chapter */}
            <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Chapter</label>
                <div className="relative flex items-center">
                    <select
                        value={form.chapter}
                        onChange={(e) => handleChapterChange(e.target.value)}
                        disabled={!form.grade || !form.subject}
                        className="w-full appearance-none pr-9 pl-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all duration-150
                            bg-slate-50 text-slate-700 border-slate-200
                            focus:border-blue-500 focus:bg-blue-50 focus:ring-2 focus:ring-blue-100
                            disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <option value="">{!form.grade || !form.subject ? "Select class & subject first..." : "Select chapter..."}</option>
                        {chapters.map((ch, i) => <option key={i} value={ch}>{ch}</option>)}
                    </select>
                    {chevron}
                </div>
            </div>

            {/* SubTopic */}
            <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">SubTopic</label>
                <div className="relative flex items-center">
                    <select
                        value={form.subTopic}
                        onChange={(e) => setField("subTopic")(e.target.value)}
                        disabled={!form.chapter}
                        className="w-full appearance-none pr-9 pl-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all duration-150
                            bg-slate-50 text-slate-700 border-slate-200
                            focus:border-blue-500 focus:bg-blue-50 focus:ring-2 focus:ring-blue-100
                            disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <option value="">{!form.chapter ? "Select chapter first..." : "Select subtopic..."}</option>
                        {subTopics.map((st, i) => <option key={i} value={st}>{st}</option>)}
                    </select>
                    {chevron}
                </div>
            </div>

            {/* Difficulty */}
            <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Difficulty</label>
                <div className="flex gap-2">
                    {DIFFICULTIES.map(({ label, active, inactive }) => (
                        <button
                            key={label}
                            type="button"
                            onClick={() => setField("difficulty")(label)}
                            className={`flex-1 py-2 rounded-xl border-2 text-sm font-semibold transition-all duration-150
                                ${form.difficulty === label ? active : inactive}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Exam Tags */}
            <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Exam Tags</label>
                <div className="flex gap-2 flex-wrap">
                    {TAGS.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className={`px-3.5 py-1.5 rounded-xl border-2 text-[12px] font-semibold transition-all duration-150
                                ${form.tags.includes(tag)
                                    ? "border-blue-500 bg-blue-50 text-blue-600"
                                    : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300"
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
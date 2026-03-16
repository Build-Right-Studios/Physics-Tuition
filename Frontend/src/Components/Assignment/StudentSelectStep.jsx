export default function StudentSelectStep({ students, selectedStudentIds, toggleStudent, selectAll, clearAll, gradeFilter, setGradeFilter }) {
    if (!students.length) return null;

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div className="flex items-start gap-3">
                    <span className="text-blue-500 text-lg mt-0.5">👥</span>
                    <div>
                        <h2 className="text-[14.5px] font-semibold text-slate-800 tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                            Select Students
                        </h2>
                        <p className="text-[12px] text-slate-400 mt-0.5">{selectedStudentIds.length} selected</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={selectAll} className="text-[11px] font-semibold text-blue-600 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all">All</button>
                    <button onClick={clearAll}  className="text-[11px] font-semibold text-slate-500 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all">Clear</button>
                </div>
            </div>

            {/* Grade filter */}
            <div className="flex gap-2">
                {["", "11", "12"].map(g => (
                    <button
                        key={g}
                        onClick={() => setGradeFilter(g)}
                        className={`px-3 py-1.5 rounded-xl border text-[12px] font-semibold transition-all
                            ${gradeFilter === g
                                ? "border-blue-500 bg-blue-50 text-blue-600"
                                : "border-slate-200 bg-white text-slate-500"
                            }`}
                    >
                        {g === "" ? "All" : `Class ${g}`}
                    </button>
                ))}
            </div>

            {/* Student list */}
            <div className="flex flex-col gap-2">
                {students
                    .filter(s => gradeFilter === "" || s.grade === gradeFilter)
                    .map(student => (
                        <div
                            key={student._id}
                            onClick={() => toggleStudent(student._id)}
                            className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                                ${selectedStudentIds.includes(student._id)
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-slate-200 bg-slate-50 hover:border-slate-300"
                                }`}
                        >
                            {/* Checkbox */}
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all
                                ${selectedStudentIds.includes(student._id)
                                    ? "border-blue-500 bg-blue-500"
                                    : "border-slate-300 bg-white"
                                }`}
                            >
                                {selectedStudentIds.includes(student._id) && (
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </div>

                            <div className="flex flex-col flex-1">
                                <span className="text-[13px] text-slate-700 font-medium">{student.name}</span>
                                <span className="text-[11px] text-slate-400">{student.phone} • Class {student.grade}</span>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
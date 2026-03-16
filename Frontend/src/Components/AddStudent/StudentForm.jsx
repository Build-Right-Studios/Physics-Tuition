// Components/AddStudent/StudentForm.jsx

export default function StudentForm({ form, setField, loading, onSubmit, onCancel }) {
    return (
        <>
            {/* Full Name */}
            <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                    Full Name
                </label>
                <div className="relative flex items-center">
                    <span className="absolute left-3 text-slate-400">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setField("name")(e.target.value)}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all duration-150
                            bg-slate-50 text-slate-700 border-slate-200 placeholder:text-slate-300
                            focus:border-blue-500 focus:bg-blue-50 focus:ring-2 focus:ring-blue-100"
                    />
                </div>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                    Phone Number
                </label>
                <div className="relative flex items-center">
                    <span className="absolute left-3 text-slate-400">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                    </span>
                    <div className="absolute left-9 text-slate-400 text-sm font-medium border-r border-slate-200 pr-2.5">
                        +91
                    </div>
                    <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setField("phone")(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="98765 43210"
                        className="w-full pl-20 pr-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all duration-150
                            bg-slate-50 text-slate-700 border-slate-200 placeholder:text-slate-300
                            focus:border-blue-500 focus:bg-blue-50 focus:ring-2 focus:ring-blue-100"
                    />
                </div>
            </div>

            {/* Parent Phone */}
            <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                    Parent Phone{" "}
                    <span className="text-slate-300 normal-case tracking-normal font-normal">(optional)</span>
                </label>
                <div className="relative flex items-center">
                    <span className="absolute left-3 text-slate-400">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </span>
                    <div className="absolute left-9 text-slate-400 text-sm font-medium border-r border-slate-200 pr-2.5">
                        +91
                    </div>
                    <input
                        type="tel"
                        value={form.parentPhone}
                        onChange={(e) => setField("parentPhone")(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="98765 00000"
                        className="w-full pl-20 pr-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all duration-150
                            bg-slate-50 text-slate-700 border-slate-200 placeholder:text-slate-300
                            focus:border-blue-500 focus:bg-blue-50 focus:ring-2 focus:ring-blue-100"
                    />
                </div>
            </div>

            {/* Grade */}
            <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                    Class
                </label>
                <div className="relative flex items-center">
                    <select
                        value={form.grade}
                        onChange={(e) => setField("grade")(e.target.value)}
                        className="w-full appearance-none pr-9 pl-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all duration-150
                            bg-slate-50 text-slate-700 border-slate-200
                            focus:border-blue-500 focus:bg-blue-50 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="">Select Class</option>
                        <option value="11">Class 11</option>
                        <option value="12">Class 12</option>
                    </select>
                    <span className="pointer-events-none absolute right-3 text-slate-400">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 9l6 6 6-6" />
                        </svg>
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-1">
                <button
                    onClick={onCancel}
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-500
                        bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-150
                        disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Clear
                </button>
                <button
                    onClick={onSubmit}
                    disabled={loading}
                    className="flex-[2] py-2.5 rounded-xl text-sm font-semibold text-white
                        bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all duration-150
                        disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-blue-200"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                            Adding...
                        </>
                    ) : (
                        <>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <line x1="19" y1="8" x2="19" y2="14" />
                                <line x1="22" y1="11" x2="16" y2="11" />
                            </svg>
                            Add Student
                        </>
                    )}
                </button>
            </div>
        </>
    );
}
// Components/AddQuestion/QuestionMediaCard.jsx

import { useRef } from "react";

function StatementPreview({ statement }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                Extracted Statement
            </label>
            <div className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-600 leading-relaxed">
                {statement}
            </div>
        </div>
    );
}

function UploadZone({ label, sublabel, file, onFileChange, existingUrl }) {
    const inputRef = useRef();

    const handleDrop = (e) => {
        e.preventDefault();
        const dropped = e.dataTransfer.files[0];
        if (dropped) onFileChange(dropped);
    };

    const preview = file ? URL.createObjectURL(file) : existingUrl || null;

    return (
        <div
            onClick={() => inputRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`relative flex flex-col items-center justify-center gap-2 py-5 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-150
                ${preview ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"}`}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onFileChange(e.target.files[0])}
            />

            {preview ? (
                <>
                    <img
                        src={preview}
                        alt="preview"
                        className="w-full max-h-32 object-contain rounded-lg px-2"
                    />
                    <span className="text-[11px] text-blue-500 font-medium">
                        {file ? file.name : "Existing image — tap to replace"}
                    </span>
                </>
            ) : (
                <>
                    <span className="text-slate-300">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                            <circle cx="12" cy="13" r="4" />
                        </svg>
                    </span>
                    <span className="text-[12px] text-slate-400 font-medium">{label}</span>
                    {sublabel && <span className="text-[11px] text-slate-300">{sublabel}</span>}
                </>
            )}
        </div>
    );
}

export default function QuestionMediaCard({
    textImage, setTextImage,
    diagramImage, setDiagramImage,
    specialNote, setSpecialNote,
    existingStatement,   // populated when editing
    existingDiagramUrl,  // populated when editing
}) {
    const isEditMode = !!existingStatement;

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm shadow-slate-100 border border-slate-100 flex flex-col gap-4">
            {/* Card Header */}
            <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                <span className="text-blue-500 text-lg mt-0.5 flex-shrink-0">📷</span>
                <div>
                    <h2 className="text-[14.5px] font-semibold text-slate-800 tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                        Question Media
                    </h2>
                    <p className="text-[12px] text-slate-400 mt-0.5">
                        {isEditMode
                            ? "Upload new images to replace existing ones, or leave as is."
                            : "Upload question text and diagram separately."}
                    </p>
                </div>
            </div>

            {/* ── Edit mode: show existing statement + optional re-upload ── */}
            {isEditMode ? (
                <div className="flex flex-col gap-4">
                    {/* Existing extracted statement */}
                    <StatementPreview statement={existingStatement} />

                    {/* Re-upload text image — optional */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                            Replace Text Photo{" "}
                            <span className="text-slate-300 normal-case tracking-normal font-normal">(optional — re-runs OCR)</span>
                        </label>
                        <UploadZone
                            label="Upload New Question Text Photo"
                            sublabel="Replaces extracted statement via OCR"
                            file={textImage}
                            onFileChange={setTextImage}
                        />
                    </div>
                </div>
            ) : (
                /* ── Add mode: standard text image upload ── */
                <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                        Question Text Photo
                    </label>
                    <UploadZone
                        label="Upload Question Text Photo"
                        sublabel="Used for OCR — not stored"
                        file={textImage}
                        onFileChange={setTextImage}
                    />
                </div>
            )}

            {/* Diagram — always shown, existingUrl pre-fills in edit mode */}
            <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                    Diagram{" "}
                    <span className="text-slate-300 normal-case tracking-normal font-normal">(optional)</span>
                </label>
                <UploadZone
                    label="Upload Question Diagram"
                    sublabel="Saved and shown to students"
                    file={diagramImage}
                    onFileChange={setDiagramImage}
                    existingUrl={existingDiagramUrl}
                />
            </div>

            {/* Special Note */}
            <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                    Special Note{" "}
                    <span className="text-slate-300 normal-case tracking-normal font-normal">(optional)</span>
                </label>
                <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-400">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                    </span>
                    <textarea
                        value={specialNote}
                        onChange={(e) => setSpecialNote(e.target.value)}
                        placeholder="Add any specific instructions or context..."
                        rows={3}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all duration-150 resize-none
                            bg-slate-50 text-slate-700 border-slate-200 placeholder:text-slate-300
                            focus:border-blue-500 focus:bg-blue-50 focus:ring-2 focus:ring-blue-100"
                    />
                </div>
            </div>
        </div>
    );
}
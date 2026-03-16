export default function ClassificationCard({ grade, subject, chapter, subTopic, tags }) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Classification</p>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <span className="text-[12px] text-slate-400">Class</span>
                    <span className="text-[13px] text-slate-700 font-medium">Class {grade}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[12px] text-slate-400">Subject</span>
                    <span className="text-[13px] text-slate-700 font-medium">{subject}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[12px] text-slate-400">Chapter</span>
                    <span className="text-[13px] text-slate-700 font-medium text-right max-w-[60%]">{chapter?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[12px] text-slate-400">Subtopic</span>
                    <span className="text-[13px] text-slate-700 font-medium text-right max-w-[60%]">{subTopic?.name}</span>
                </div>
            </div>
            <div className="flex gap-1.5 flex-wrap pt-1">
                {tags?.map(tag => (
                    <span key={tag} className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}
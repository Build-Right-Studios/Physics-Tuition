// Components/SubTopic/SubTopicInput.jsx

export default function SubTopicInput({ subtopicName, setSubtopicName }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                Subtopic Name
            </label>
            <input
                type="text"
                placeholder="e.g., Projectile Motion on Inclined Plane"
                value={subtopicName}
                onChange={(e) => setSubtopicName(e.target.value)}
                maxLength={120}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-150 focus:border-blue-500 focus:bg-blue-50 focus:ring-2 focus:ring-blue-100"
            />
            <span className="text-[11px] text-slate-400 self-end">
                {subtopicName.length}/120
            </span>
        </div>
    );
}
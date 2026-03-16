export default function SpecialNoteCard({ specialNote }) {
    if (!specialNote) return null;
    return (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-500 mb-1">Special Note</p>
            <p className="text-[13px] text-amber-700">{specialNote}</p>
        </div>
    );
}
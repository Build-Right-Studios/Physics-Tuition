// Components/AddStudent/FormCard.jsx

export default function FormCard({ icon, title, desc, children }) {
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
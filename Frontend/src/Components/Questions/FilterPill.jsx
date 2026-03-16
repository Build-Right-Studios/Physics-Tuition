import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function FilterPill({ name, label, options, value, onSelect, openDropdown, setOpenDropdown }) {
    const isOpen = openDropdown === name;
    const buttonRef = useRef(null);
    const [dropdownStyle, setDropdownStyle] = useState({});

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownStyle({
                position: "fixed",
                top: rect.bottom + 6,
                left: rect.left,
                zIndex: 9999,
                minWidth: "180px",
            });
        }
    }, [isOpen]);

    return (
        <div className="relative flex-shrink-0">
            <button
                ref={buttonRef}
                onClick={() => setOpenDropdown(isOpen ? null : name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[13px] font-semibold transition-all whitespace-nowrap
                    ${value
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
            >
                {value || label}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>

            {isOpen && createPortal(
                <div
                    style={dropdownStyle}
                    className="bg-white border border-slate-200 rounded-xl shadow-xl max-h-52 overflow-y-auto"
                >
                    <button
                        onClick={() => { onSelect(""); setOpenDropdown(null); }}
                        className="w-full text-left px-4 py-2.5 text-[13px] text-slate-400 hover:bg-slate-50 border-b border-slate-100"
                    >
                        All
                    </button>
                    {options.map(opt => (
                        <button
                            key={opt}
                            onClick={() => { onSelect(opt); setOpenDropdown(null); }}
                            className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors hover:bg-slate-50
                                ${value === opt ? "text-blue-600 font-semibold bg-blue-50" : "text-slate-700"}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>,
                document.body
            )}
        </div>
    );
}
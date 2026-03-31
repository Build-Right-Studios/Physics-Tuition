// Components/Common/LatexText.jsx
import katex from "katex";
import "katex/dist/katex.min.css";
import { fixLatex, renderLatex } from "../../Constants/latex.js";

export default function LatexText({ text, className = "text-[13px] text-slate-700" }) {
    if (!text) return null;

    const cleaned = fixLatex(text);

    // Split by $...$ — math parts vs plain text parts
    const parts = cleaned.split(/(\$[^$]+\$)/g);

    return (
        <span
            className={className}
            style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
        >
            {parts.map((part, i) => {
                if (part.startsWith("$") && part.endsWith("$")) {
                    // Math part — render with KaTeX
                    const math = part.slice(1, -1);
                    const html = renderLatex(math);
                    if (html) {
                        return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
                    }
                    return <span key={i}>{math}</span>;
                }
                // Plain text — render as-is
                return <span key={i}>{part}</span>;
            })}
        </span>
    );
}
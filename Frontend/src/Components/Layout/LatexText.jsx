// Components/Common/LatexText.jsx
import katex from "katex";
import "katex/dist/katex.min.css";
import { fixLatex } from "../../Constants/latex.js";

export default function LatexText({ text, className = "text-[13px] text-slate-700" }) {
    if (!text) return null;

    const cleaned = fixLatex(text);

    // Split by $...$ patterns only
    const parts = cleaned.split(/(\$[^$]+\$)/g);

    return (
        <span
            className={className}
            style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
        >
            {parts.map((part, i) => {
                // Math part — wrapped in $...$
                if (part.startsWith("$") && part.endsWith("$")) {
                    const math = part.slice(1, -1);
                    try {
                        const html = katex.renderToString(math, {
                            throwOnError: false,
                            displayMode:  false,
                            output:       "html",
                        });
                        return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
                    } catch {
                        return <span key={i}>{math}</span>;
                    }
                }
                // Plain text — render as-is, no LaTeX processing
                return <span key={i}>{part}</span>;
            })}
        </span>
    );
}
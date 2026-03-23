import katex from "katex";
import "katex/dist/katex.min.css";

export const fixLatex = (text) => {
    if (!text) return text;
    return text
        .replace(/\\fract\b/g,       "\\frac")
        .replace(/\\episilon\b/g,    "\\epsilon")
        .replace(/\\epsilion\b/g,    "\\epsilon")
        .replace(/\\eplison\b/g,     "\\epsilon")
        .replace(/\\thetaa\b/g,      "\\theta")
        .replace(/\\aplha\b/g,       "\\alpha")
        .replace(/\\alpa\b/g,        "\\alpha")
        .replace(/\\lamda\b/g,       "\\lambda")
        .replace(/\\lamba\b/g,       "\\lambda")
        .replace(/\\time\b/g,        "\\times")
        .replace(/\\infity\b/g,      "\\infty")
        .replace(/\\infinti\b/g,     "\\infty")
        .replace(/\\muu\b/g,         "\\mu")
        .replace(/\\niu\b/g,         "\\nu")
        .replace(/\\etaa\b/g,        "\\eta")
        .replace(/\\tauu\b/g,        "\\tau")
        .replace(/\\phii\b/g,        "\\phi")
        .replace(/\\psii\b/g,        "\\psi")
        .replace(/\\omegaa\b/g,      "\\omega")
        .replace(/\\Omegaa\b/g,      "\\Omega")
        .replace(/\\sigmaa\b/g,      "\\sigma")
        .replace(/\\Sigmaa\b/g,      "\\Sigma")
        .replace(/\\deltaa\b/g,      "\\delta")
        .replace(/\\Deltaa\b/g,      "\\Delta")
        .replace(/\\gammaa\b/g,      "\\gamma")
        .replace(/\\Gammaa\b/g,      "\\Gamma")
        .replace(/\\frac([^{])/g,    "\\frac{$1}")
        .replace(/\\\\(?![\n\r])/g,  "\\")
        .replace(/\$([^$]+)\$/g,     "$1")
        .replace(/\$/g,              "")
        .replace(/(?<!\$)(\\[a-zA-Z]+\{[^}]*\}(?:\{[^}]*\})?)/g, "$$$1$$")
        .trim();
};

export const hasLatexSyntax = (text) =>
    text.includes("\\") || text.includes("^") || text.includes("_") || text.includes("frac");

export const renderLatex = (text) => {
    if (!text) return "";
    const cleaned = fixLatex(text);
    if (!hasLatexSyntax(cleaned)) return null; // null = render as plain text
    try {
        return katex.renderToString(cleaned, {
            throwOnError: false,
            displayMode:  false,
            output:       "html",
        });
    } catch {
        return null;
    }
};
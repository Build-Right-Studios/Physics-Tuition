import katex from "katex";
import "katex/dist/katex.min.css";

export const fixLatex = (text) => {
    if (!text) return text;
    return text
        // ── Fix varepsilon ────────────────────────────────────────────────
        .replace(/\\varepsilon_0/g,  "\\epsilon_0")
        .replace(/\\varepsilon/g,    "\\epsilon")

        // ── Fix double backslashes ────────────────────────────────────────
        .replace(/\\\\,/g,           "\\,")
        .replace(/\\\\(?![\n\r])/g,  "\\")

        // ── Fix common typos ──────────────────────────────────────────────
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

        // ── Fix \frac missing braces ──────────────────────────────────────
        .replace(/\\frac([^{])/g,    "\\frac{$1}")

        // ── Fix spacing ───────────────────────────────────────────────────
        .replace(/\\quad/g,          " ")
        .replace(/\\,/g,             " ")
        .trim();
};

export const hasLatexSyntax = (text) => {
    if (!text) return false;
    return text.includes("\\") || text.includes("frac");
};

// Renders a single math string (no mixed text — pure LaTeX only)
export const renderLatex = (math) => {
    if (!math) return null;
    try {
        return katex.renderToString(math, {
            throwOnError: false,
            displayMode:  false,
            output:       "html",
        });
    } catch {
        return null;
    }
};
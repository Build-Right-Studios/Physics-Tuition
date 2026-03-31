export const safeLatex = (text = "") => {
    if (!text) return "";

    return text
        // ── Handle combined symbols FIRST ─────────────────────────────
        .replace(/ε₀/g,   "$\\epsilon_0$")   // ← must be before ε and ₀
        .replace(/πε₀/g,  "$\\pi\\epsilon_0$")
        .replace(/4πε₀/g, "$4\\pi\\epsilon_0$")

        // ── Unicode superscripts ───────────────────────────────────────
        .replace(/⁻(\d+)/g,             (_, n)         => `$^{-${n}}$`)
        .replace(/²/g,                   "$^{2}$")
        .replace(/³/g,                   "$^{3}$")

        // ── Unicode subscripts ─────────────────────────────────────────
        .replace(/₀/g,   "$_{0}$")
        .replace(/₁/g,   "$_{1}$")
        .replace(/₂/g,   "$_{2}$")
        .replace(/₃/g,   "$_{3}$")

        // ── Unicode symbols ────────────────────────────────────────────
        .replace(/×/g,   "$\\times$")
        .replace(/μ/g,   "$\\mu$")
        .replace(/π/g,   "$\\pi$")
        .replace(/ε/g,   "$\\epsilon$")   // ← after ε₀
        .replace(/°/g,   "$^{\\circ}$")

        // ── Wrap bare LaTeX commands in $...$ ──────────────────────────
        .replace(/(?<!\$)(\\frac\{[^}]+\}\{[^}]+\})(?!\$)/g, "$$$1$$")
        .replace(/(?<!\$)(\\sqrt\{[^}]+\})(?!\$)/g,           "$$$1$$")

        // ── Clean up ──────────────────────────────────────────────────
        .replace(/\$\$([^$]+)\$\$/g, (_, m) => `$${m}$`);
};

export const wrapMath = (text = "") => {
    return text
        .replace(/\\frac\{[^}]+\}\{[^}]+\}/g, (m) => `$${m}$`)
        .replace(/\\times/g,                   "$\\times$")
        .replace(/10\^{?(-?\d+)}?/g,           (m) => `$${m}$`);
};
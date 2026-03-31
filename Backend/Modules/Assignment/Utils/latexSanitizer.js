export const fixLatexMath = (text = "") => {
    let output = text;

    // Wrap \frac expressions not already inside $
    output = output.replace(
        /\\frac\{[^}]+\}\{[^}]+\}/g,
        (match) => `$${match}$`
    );

    // Replace × with \times
    output = output.replace(/×/g, "\\times");

    // Fix powers like C⁻² → C^{-2}
    output = output.replace(/C⁻²/g, "C^{-2}");

    return output;
};
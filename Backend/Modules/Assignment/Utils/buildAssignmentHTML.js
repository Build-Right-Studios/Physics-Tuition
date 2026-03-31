import { safeLatex } from "./mathFormatter.js";

export const buildAssignmentHTML = ({
    questions = [],
    grade,
    subject,
    chapter,
    difficulty,
    title,
}) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    
    <!-- KaTeX CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
    
    <!-- KaTeX JS -->
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>

    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 40px;
            line-height: 1.6;
        }

        h1, h2 {
            text-align: center;
            margin: 0;
        }

        .header {
            margin-bottom: 20px;
        }

        .meta {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            margin-top: 10px;
        }

        .divider {
            margin: 15px 0;
            border-top: 1px solid #000;
        }

        .question {
            margin-bottom: 25px;
            font-size: 15px;
        }

        .q-number {
            font-weight: bold;
        }

        .options {
            margin-left: 20px;
            margin-top: 10px;
        }

        .option {
            margin-bottom: 6px;
        }

        img {
            max-width: 400px;
            display: block;
            margin: 10px auto;
        }
    </style>
</head>

<body>

    <div class="header">
        <h1>QuestionDesk</h1>
        <h2>${title || `${chapter} Assignment`}</h2>

        <div class="meta">
            <div>Class: ${grade}</div>
            <div>Subject: ${subject}</div>
            <div>Date: ${new Date().toLocaleDateString("en-IN")}</div>
        </div>

        ${difficulty ? `<div class="meta"><div>Difficulty: ${difficulty}</div></div>` : ""}

        <div class="divider"></div>
        <div>Total Questions: ${questions.length}</div>
        <div class="divider"></div>
    </div>

    ${questions.map((q, i) => `
        <div class="question">
            <span class="q-number">Q${i + 1}.</span>
            <span>${safeLatex(q.statement)}</span>

            ${q.diagramImage
            ? `<img src="${q.diagramImage}" />`
            : ""
        }

            ${q.answer?.type === "mcq"
            ? `<div class="options">
                        ${q.answer.options.map(opt => `
                            <div class="option">
                                ${opt.label}. ${safeLatex(opt.text || "")}
                                ${opt.imageUrl ? `<img src="${opt.imageUrl}" />` : ""}
                            </div>
                        `).join("")}
                       </div>`
            : ""
        }
        </div>
    `).join("")}

    <!-- KaTeX Auto Render -->
    <script>
    window.onload = function() {
        renderMathInElement(document.body, {
            delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "$",  right: "$",  display: false}
            ],
            throwOnError: false
        });
    };
</script>

</body>
</html>
`;
};
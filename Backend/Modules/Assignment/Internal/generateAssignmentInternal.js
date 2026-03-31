import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import puppeteer from "puppeteer";

import { saveAssignmentQuery } from "../Query/generateAssignmentQuery.js";
import { buildAssignmentHTML } from "../Utils/buildAssignmentHTML.js";

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ── LaTeX → Plain Text ────────────────────────────────────────────────────────
// const latexToPlainText = (text) => {
//     if (!text) return "";
//     return text
//         // ── Fix combined patterns first ──────────────────────────────────
//         .replace(/\\pi\\epsilon_0/g,            "pi*e0")
//         .replace(/\\pi\\epsilon/g,              "pi*e")
//         .replace(/\\4\\pi\\epsilon_0/g,         "4*pi*e0")

//         // ── LaTeX commands ───────────────────────────────────────────────
//         .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)")
//         .replace(/\\sqrt\{([^}]+)\}/g,            "sqrt($1)")
//         .replace(/\\text\{([^}]+)\}/g,            "$1")
//         .replace(/\\times/g,                      "x")
//         .replace(/\\cdot/g,                       ".")
//         .replace(/\\pi/g,                         "pi")
//         .replace(/\\epsilon_0/g,                  "e0")
//         .replace(/\\epsilon/g,                    "e")
//         .replace(/\\alpha/g,                      "alpha")
//         .replace(/\\beta/g,                       "beta")
//         .replace(/\\gamma/g,                      "gamma")
//         .replace(/\\Gamma/g,                      "Gamma")
//         .replace(/\\delta/g,                      "delta")
//         .replace(/\\Delta/g,                      "Delta")
//         .replace(/\\theta/g,                      "theta")
//         .replace(/\\lambda/g,                     "lambda")
//         .replace(/\\mu/g,                         "u")
//         .replace(/\\nu/g,                         "v")
//         .replace(/\\sigma/g,                      "sigma")
//         .replace(/\\Sigma/g,                      "Sigma")
//         .replace(/\\omega/g,                      "omega")
//         .replace(/\\Omega/g,                      "Omega")
//         .replace(/\\phi/g,                        "phi")
//         .replace(/\\psi/g,                        "psi")
//         .replace(/\\eta/g,                        "eta")
//         .replace(/\\tau/g,                        "tau")
//         .replace(/\\rho/g,                        "rho")
//         .replace(/\\infty/g,                      "infinity")
//         .replace(/\\pm/g,                         "+/-")
//         .replace(/\\leq/g,                        "<=")
//         .replace(/\\geq/g,                        ">=")
//         .replace(/\\neq/g,                        "!=")
//         .replace(/\\approx/g,                     "~=")
//         .replace(/\\rightarrow/g,                 "->")
//         .replace(/\\leftarrow/g,                  "<-")
//         .replace(/\\Rightarrow/g,                 "=>")
//         .replace(/\\propto/g,                     "proportional to")

//         // ── Superscripts/subscripts ──────────────────────────────────────
//         .replace(/\^{([^}]+)}/g,                  "^($1)")
//         .replace(/_{([^}]+)}/g,                   "_$1")

//         // ── Fix double superscript — ^- ^3 → ^-3 ────────────────────────
//         .replace(/\^-\s*\^\s*(\d)/g,              "^-$1")
//         .replace(/\^(-?\d*)\^(-?\d+)/g,           "^$1$2")

//         // ── Strip $ wrappers ─────────────────────────────────────────────
//         .replace(/\$([^$]+)\$/g,                  "$1")

//         // ── Unicode superscripts → ASCII ─────────────────────────────────
//         .replace(/⁰/g,  "^0")
//         .replace(/¹/g,  "^1")
//         .replace(/²/g,  "^2")
//         .replace(/³/g,  "^3")
//         .replace(/⁴/g,  "^4")
//         .replace(/⁵/g,  "^5")
//         .replace(/⁶/g,  "^6")
//         .replace(/⁷/g,  "^7")
//         .replace(/⁸/g,  "^8")
//         .replace(/⁹/g,  "^9")
//         .replace(/⁻/g,  "^-")

//         // ── Unicode subscripts → ASCII ───────────────────────────────────
//         .replace(/₀/g,  "0")
//         .replace(/₁/g,  "1")
//         .replace(/₂/g,  "2")
//         .replace(/₃/g,  "3")
//         .replace(/₄/g,  "4")

//         // ── Unicode symbols → ASCII ──────────────────────────────────────
//         .replace(/μ/g,  "u")
//         .replace(/π/g,  "pi")
//         .replace(/ε/g,  "e")
//         .replace(/°/g,  " degrees")
//         .replace(/×/g,  "x")
//         .replace(/→/g,  "->")
//         .replace(/←/g,  "<-")
//         .replace(/≤/g,  "<=")
//         .replace(/≥/g,  ">=")
//         .replace(/≠/g,  "!=")
//         .replace(/≈/g,  "~=")
//         .replace(/∞/g,  "infinity")
//         .replace(/±/g,  "+/-")
//         .replace(/√/g,  "sqrt")
//         .replace(/∝/g,  "proportional to")

//         // ── Fix ^- ^3 after unicode conversion ───────────────────────────
//         .replace(/\^-\s*\^\s*(\d)/g,  "^-$1")
//         .replace(/\^(-?\d*)\^(-?\d+)/g, "^$1$2")

//         // ── Strip remaining LaTeX artifacts ──────────────────────────────
//         .replace(/\\/g,   "")
//         .replace(/[{}]/g, "")
//         .trim();
// };
// // ─────────────────────────────────────────────────────────────────────────────

// const fetchImageBuffer = (url, timeoutMs = 5000) => {
//     return new Promise((resolve, reject) => {
//         const client = url.startsWith("https") ? https : http;
//         const req = client.get(url, (res) => {
//             const chunks = [];
//             res.on("data",  chunk => chunks.push(chunk));
//             res.on("end",   () => resolve(Buffer.concat(chunks)));
//             res.on("error", reject);
//         });
//         req.setTimeout(timeoutMs, () => {
//             req.destroy();
//             reject(new Error("Image fetch timeout"));
//         });
//         req.on("error", reject);
//     });
// };

// export const generatePDFInternal = async (userData) => {
//     const { questions, grade, subject, chapter, difficulty, title } = userData;

//     console.log("Questions received in PDF generator:", questions.map(q => ({
//         id:        q._id,
//         statement: q.statement?.slice(0, 50),
//     })));

//     const imageCache = {};
//     await Promise.all(questions.map(async (q) => {
//         if (q.diagramImage) {
//             try { imageCache[q.diagramImage] = await fetchImageBuffer(q.diagramImage); } catch {}
//         }
//         if (q.answer?.options) {
//             await Promise.all(q.answer.options.map(async (opt) => {
//                 if (opt.imageUrl) {
//                     try { imageCache[opt.imageUrl] = await fetchImageBuffer(opt.imageUrl); } catch {}
//                 }
//             }));
//         }
//     }));

//     return new Promise((resolve, reject) => {
//         try {
//             const doc      = new PDFDocument({ margin: 50 });
//             const fileName = `assignment_${Date.now()}.pdf`;
//             const filePath = path.join(uploadsDir, fileName);
//             const stream   = fs.createWriteStream(filePath);

//             doc.pipe(stream);

//             // ── Header ────────────────────────────────────────────────────
//             doc.fontSize(20).font("Helvetica-Bold").text("QuestionDesk", { align: "center" });
//             doc.moveDown(0.3);
//             doc.fontSize(14).font("Helvetica-Bold").text(title || `${chapter} Assignment`, { align: "center" });
//             doc.moveDown(0.3);
//             doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
//             doc.moveDown(0.5);

//             const headerY = doc.y;
//             doc.fontSize(10).font("Helvetica");
//             doc.text(`Class: ${grade}`,     50,  headerY);
//             doc.text(`Subject: ${subject}`, 250, headerY);
//             doc.text(`Date: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}`, 420, headerY);
//             doc.moveDown(0.3);
//             if (difficulty) doc.text(`Difficulty: ${difficulty}`, 50);
//             doc.text(`Total Questions: ${questions.length}`, 250, doc.y - doc.currentLineHeight());
//             doc.moveDown(0.5);
//             doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
//             doc.moveDown(0.8);

//             // ── Questions ─────────────────────────────────────────────────
//             for (let i = 0; i < questions.length; i++) {
//                 const q = questions[i];

//                 console.log(`Q${i + 1} raw statement:`,     q.statement);
//                 console.log(`Q${i + 1} cleaned statement:`, latexToPlainText(q.statement || ""));

//                 if (doc.y > 650) doc.addPage();

//                 // Question number + statement
//                 doc.fontSize(11).font("Helvetica-Bold")
//                    .text(`Q${i + 1}.  `, 50, doc.y, { continued: true, lineBreak: false });
//                 doc.font("Helvetica")
//                    .text(`${latexToPlainText(q.statement || "")}`, { width: 480, align: "left" });
//                 doc.moveDown(0.6);

//                 // Diagram image
//                 if (q.diagramImage && imageCache[q.diagramImage]) {
//                     try {
//                         if (doc.y + 200 > 720) doc.addPage();
//                         doc.image(imageCache[q.diagramImage], {
//                             fit:   [400, 200],
//                             align: "center",
//                             x:     75,
//                         });
//                         doc.moveDown(0.6);
//                     } catch {}
//                 }

//                 // MCQ options
//                 if (q.answer?.type === "mcq" && q.answer?.options?.length) {
//                     for (const option of q.answer.options) {
//                         if (option.imageUrl && imageCache[option.imageUrl]) {
//                             try {
//                                 const imageHeight = 70;
//                                 if (doc.y + imageHeight > 720) doc.addPage();

//                                 const optionY = doc.y;
//                                 doc.image(imageCache[option.imageUrl], 80, optionY, {
//                                     fit:   [450, imageHeight],
//                                     align: "left",
//                                 });
//                                 doc.fontSize(10).font("Helvetica-Bold")
//                                    .text(`${option.label}.`, 60, optionY + (imageHeight / 2) - 6, {
//                                        width:     18,
//                                        lineBreak: false,
//                                    });
//                                 doc.y = optionY + imageHeight + 8;
//                             } catch {
//                                 doc.fontSize(10).font("Helvetica")
//                                    .text(`${option.label}. [image]`, 60);
//                                 doc.moveDown(0.2);
//                             }
//                         } else {
//                             if (doc.y + 20 > 720) doc.addPage();
//                             doc.fontSize(10).font("Helvetica")
//                                .text(`${option.label}.  ${latexToPlainText(option.text || "")}`, 60, doc.y, {
//                                    width: 480,
//                                });
//                             doc.moveDown(0.3);
//                         }
//                     }
//                     doc.moveDown(0.3);
//                 }

//                 doc.moveDown(0.5);
//             }

//             doc.end();
//             stream.on("finish", () => resolve(filePath));
//             stream.on("error",  reject);
//         } catch (error) {
//             reject(error);
//         }
//     });
// };

export const generatePDFInternal = async (data) => {
    // console.log("generatePDFInternal called with:", {
    //     grade: data.grade,
    //     subject: data.subject,
    //     chapter: data.chapter,
    //     difficulty: data.difficulty,
    //     title: data.title,
    //     questionCount: data.questions?.length,
    //     questions: data.questions?.map(q => ({
    //         id: q._id,
    //         statement: q.statement?.slice(0, 80),
    //     })),
    // });
    const html = buildAssignmentHTML(data);

    const filePath = path.join(process.cwd(), "uploads", `assignment_${Date.now()}.pdf`);

    const browser = await puppeteer.launch({
        headless: "new"
    });

    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    // 🔥 IMPORTANT: wait for KaTeX render
    await new Promise(resolve => setTimeout(resolve, 1500));

    await page.pdf({
        path: filePath,
        format: "A4",
        printBackground: true,
        margin: {
            top: "40px",
            bottom: "40px",
            left: "30px",
            right: "30px"
        }
    });

    await browser.close();

    return filePath;
};

export const saveAssignmentInternal = async (userData) => {
    try {
        return await saveAssignmentQuery(userData);
    } catch (error) {
        console.error("Error in saveAssignmentInternal:", error);
        throw error;
    }
};
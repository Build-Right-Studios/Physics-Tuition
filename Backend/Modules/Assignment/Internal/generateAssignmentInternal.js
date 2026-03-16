import PDFDocument from "pdfkit";
import fs          from "fs";
import path        from "path";
import https       from "https";
import http        from "http";
import { saveAssignmentQuery } from "../Query/generateAssignmentQuery.js";

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const fetchImageBuffer = (url, timeoutMs = 5000) => {
    return new Promise((resolve, reject) => {
        const client = url.startsWith("https") ? https : http;
        const req = client.get(url, (res) => {
            const chunks = [];
            res.on("data",  chunk => chunks.push(chunk));
            res.on("end",   () => resolve(Buffer.concat(chunks)));
            res.on("error", reject);
        });
        req.setTimeout(timeoutMs, () => {
            req.destroy();
            reject(new Error("Image fetch timeout"));
        });
        req.on("error", reject);
    });
};

export const generatePDFInternal = async (userData) => {
    const { questions, grade, subject, chapter, difficulty, title } = userData;

    const imageCache = {};
    await Promise.all(questions.map(async (q) => {
        if (q.diagramImage) {
            try { imageCache[q.diagramImage] = await fetchImageBuffer(q.diagramImage); } catch {}
        }
        if (q.answer?.options) {
            await Promise.all(q.answer.options.map(async (opt) => {
                if (opt.imageUrl) {
                    try { imageCache[opt.imageUrl] = await fetchImageBuffer(opt.imageUrl); } catch {}
                }
            }));
        }
    }));

    return new Promise((resolve, reject) => {
        try {
            const doc      = new PDFDocument({ margin: 50 });
            const fileName = `assignment_${Date.now()}.pdf`;
            const filePath = path.join(uploadsDir, fileName);
            const stream   = fs.createWriteStream(filePath);

            doc.pipe(stream);

            // ── Header ────────────────────────────────────────────────────
            doc.fontSize(20).font("Helvetica-Bold").text("QuestionDesk", { align: "center" });
            doc.moveDown(0.3);
            doc.fontSize(14).font("Helvetica-Bold").text(title || `${chapter} Assignment`, { align: "center" });
            doc.moveDown(0.3);
            doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
            doc.moveDown(0.5);

            const headerY = doc.y;
            doc.fontSize(10).font("Helvetica");
            doc.text(`Class: ${grade}`,     50,  headerY);
            doc.text(`Subject: ${subject}`, 250, headerY);
            doc.text(`Date: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}`, 420, headerY);
            doc.moveDown(0.3);
            if (difficulty) doc.text(`Difficulty: ${difficulty}`, 50);
            doc.text(`Total Questions: ${questions.length}`, 250, doc.y - doc.currentLineHeight());
            doc.moveDown(0.5);
            doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
            doc.moveDown(0.8);

            // ── Questions ─────────────────────────────────────────────────
            for (let i = 0; i < questions.length; i++) {
                const q = questions[i];

                // Page break before question if not enough space
                if (doc.y > 650) doc.addPage();

                // Question number + statement
                doc.fontSize(11).font("Helvetica-Bold")
                   .text(`Q${i + 1}.  `, 50, doc.y, { continued: true, lineBreak: false });
                doc.font("Helvetica")
                   .text(`${q.statement || ""}`, { width: 480, align: "left" });
                doc.moveDown(0.6);

                // Diagram image
                if (q.diagramImage && imageCache[q.diagramImage]) {
                    try {
                        // Page break if diagram won't fit
                        if (doc.y + 200 > 720) doc.addPage();

                        doc.image(imageCache[q.diagramImage], {
                            fit:   [400, 200],
                            align: "center",
                            x:     75,
                        });
                        doc.moveDown(0.6);
                    } catch {}
                }

                // MCQ options
                if (q.answer?.type === "mcq" && q.answer?.options?.length) {
                    for (const option of q.answer.options) {
                        if (option.imageUrl && imageCache[option.imageUrl]) {
                            try {
                                const imageHeight = 70;

                                // Page break if option image won't fit
                                if (doc.y + imageHeight > 720) doc.addPage();

                                const optionY = doc.y;

                                // Image placed first
                                doc.image(imageCache[option.imageUrl], 80, optionY, {
                                    fit:   [450, imageHeight],
                                    align: "left",
                                });

                                // Label vertically centered over image
                                doc.fontSize(10).font("Helvetica-Bold")
                                   .text(`${option.label}.`, 60, optionY + (imageHeight / 2) - 6, {
                                       width:     18,
                                       lineBreak: false,
                                   });

                                // Move cursor below image
                                doc.y = optionY + imageHeight + 8;
                            } catch {
                                doc.fontSize(10).font("Helvetica")
                                   .text(`${option.label}. [image]`, 60);
                                doc.moveDown(0.2);
                            }
                        } else {
                            // Page break if text option won't fit
                            if (doc.y + 20 > 720) doc.addPage();

                            doc.fontSize(10).font("Helvetica")
                               .text(`${option.label}.  ${option.text || ""}`, 60, doc.y, {
                                   width: 480,
                               });
                            doc.moveDown(0.3);
                        }
                    }
                    doc.moveDown(0.3);
                }

                doc.moveDown(0.5);
            }

            doc.end();
            stream.on("finish", () => resolve(filePath));
            stream.on("error",  reject);
        } catch (error) {
            reject(error);
        }
    });
};

export const saveAssignmentInternal = async (userData) => {
    try {
        return await saveAssignmentQuery(userData);
    } catch (error) {
        console.error("Error in saveAssignmentInternal:", error);
        throw error;
    }
};
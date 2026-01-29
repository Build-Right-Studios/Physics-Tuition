export const generateChapterId = ({ grade, subject, chapterNo }) => {
  const subjectCode = subject
    .toLowerCase()
    .replace(/\s+/g, "")
    .slice(0, 3); // physics -> phy

  const paddedChapterNo = String(chapterNo).padStart(2, "0");

  return `ch_${grade}_${subjectCode}_${paddedChapterNo}`;
};
import { useState } from "react";
import FilterPill from "./FilterPill.jsx";

const GRADES       = ["11", "12"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const EXAM_TAGS    = ["NEET", "JEE Main", "JEE Advanced", "CBSE Board", "NCERT", "NCERT Exemplar"];

export default function FilterBar({ filters, setFilter, chapters, subTopics }) {
    const [openDropdown, setOpenDropdown] = useState(null);

    return (
        <div
            className="flex gap-3"
            style={{
                overflowX: "auto",
                overflowY: "visible",
                WebkitOverflowScrolling: "touch",
                paddingBottom: "4px",
                msOverflowStyle: "none",
                scrollbarWidth: "none",
            }}
        >
            {/* <FilterPill
                name="exam"
                label="Exam"
                options={EXAM_TAGS}
                value={filters.exam}
                onSelect={setFilter("exam")}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
            /> */}
            <FilterPill
                name="grade"
                label="Class"
                options={GRADES.map(g => `Class ${g}`)}
                value={filters.grade ? `Class ${filters.grade}` : ""}
                onSelect={(v) => setFilter("grade")(v ? v.replace("Class ", "") : "")}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
            />
            <FilterPill
                name="chapter"
                label="Chapter"
                options={chapters}
                value={filters.chapter}
                onSelect={setFilter("chapter")}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
            />
            <FilterPill
                name="subtopic"
                label="Subtopic"
                options={subTopics}
                value={filters.subtopic}
                onSelect={setFilter("subtopic")}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
            />
            <FilterPill
                name="difficulty"
                label="Difficulty"
                options={DIFFICULTIES}
                value={filters.difficulty}
                onSelect={setFilter("difficulty")}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
            />
        </div>
    );
}
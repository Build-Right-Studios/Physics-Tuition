import User from "../../../MongoDb/User.js";

export const getStudentsQuery = async (userData) => {
    try {
        const { grade } = userData;

        const filter = { role: "student", isActive: true };
        if (grade) filter.grade = grade;

        return await User
            .find(filter)
            .select("name phone grade")
            .sort({ name: 1 })
            .lean();
    } catch (error) {
        console.error("Error in getStudentsQuery:", error);
        throw new Error("Failed to get students.");
    }
};
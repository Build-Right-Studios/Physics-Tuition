import User from "../../../MongoDb/User.js";

export const getStudentQuery = async (userData) => {
    try {
        const { name, phone } = userData;
        const existingStudent = await User.findOne({ name, phone });
        return existingStudent;
    } catch (error) {
        console.error("Error in getStudentQuery:", error);
        throw new Error("Failed to get Student.")
    }
}

export const addStudentQuery = async (userData) => {
    try {
        const { name, phone, parentPhone, role, grade } = userData;
        const newStudent = new User({ name, phone, parentPhone, role, grade });
        const savedStudent = await newStudent.save();

        return savedStudent.toObject();
    } catch (error) {
        console.error("Error in addStudentQuery:", error);
        throw new Error("Failed to add Student.")
    }
}
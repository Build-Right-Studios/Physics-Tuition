import { getStudentQuery, addStudentQuery } from "../Query/addStudentQuery.js"

export const getStudentInternal = async (userData) => {
    try {
        const { name, phone } = userData;
        const existingStudent = await getStudentQuery({ name, phone })
        return existingStudent;
    } catch (error) {
        console.error("Error in getStudentInternal:", error);
        throw new Error("Failed to get Student.")
    }
}

export const addStudentInternal = async (userData) => {
    try {
        const { name, phone, parentPhone, role, grade } = userData;
        const newStudent = await addStudentQuery({ name, phone, parentPhone, role, grade })
        return newStudent;
    } catch (error) {
        console.error("Error in addStudentInternal:", error);
        throw new Error("Failed to add Student.")
    }
}
import { getStudentInternal, addStudentInternal } from "../Internal/addStudentInternal.js"

export const addStudentService = async (userData) => {
    try {
        const { name, phone, parentPhone, role } = userData;

        //Check Existing Chapter
        const existingStudent = await getStudentInternal({ name, phone });
        if(existingStudent) {
            throw { status: 500, message: "Student Already exists"};
        }

        const newStudent = await addStudentInternal({ name, phone, parentPhone, role });

        return newStudent;
    } catch (error) {
        console.error("Error in addStudentService:", error);
        throw new Error("Failed to add Student.")
    }
}
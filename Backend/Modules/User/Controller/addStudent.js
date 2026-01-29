import { addStudentService } from "../Service/addStudentService.js"

export const addStudent = async (req, res) => {
    try {
        const { name, phone, parentPhone, role } = req.body;
        if (!name) { throw { status: 400, message: "Name is missing." };}
        if (!phone) { throw { status: 400, message: "Phone Number is missing." };}
        if (!parentPhone) { throw { status: 400, message: "Parent Phone Number is missing." };}
        if (!role) { throw { status: 400, message: "Role is missing." };}

        const data = await addStudentService({ name, phone, parentPhone, role });

        return res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        console.error("Error in addStudent:", error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Failed to add Student.",
        });
    }
}

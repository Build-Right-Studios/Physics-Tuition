import { signupService } from "../Service/signupService.js"

export const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!email) { throw { status: 400, message: "Email is missing." };}
        if (!password) { throw { status: 400, message: "Password is missing." };}

        const data = await signupService({ name, email, password, role });

        return res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        console.error("Error in signup:", error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Failed to Signup",
        });
    }

}

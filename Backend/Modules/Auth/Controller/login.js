import { loginService } from "../Service/loginService.js"

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) { throw { status: 400, message: "Email is missing." };}
        if (!password) { throw { status: 400, message: "Password is missing." };}

        const data = await loginService({ email, password });

        return res.status(200).json({
            success: true,
            user: data.user,
            token: data.token
        })
    } catch (error) {
        console.error("Error in Login:", error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Failed to Login",
        });
    }

}

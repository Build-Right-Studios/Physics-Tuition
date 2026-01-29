import bcrypt from "bcrypt"
import { loginInternal } from "../Internal/loginInternal.js"
import { generateToken } from "../../../Config/token.js";

export const loginService = async (userData) => {
    try {
        const { email, password } = userData;

        const user = await loginInternal({ email });

        if (!user) {
            throw { status: 401, message: "User doesn't exist" };
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
            throw { status: 401, message: "Invalid password"};
        }

        const token = await generateToken({userId: user._id});

        return {user, token};
    } catch (error) {
        console.error("Error in loginService:", error);
        throw new Error("Error in login:")
    }
}
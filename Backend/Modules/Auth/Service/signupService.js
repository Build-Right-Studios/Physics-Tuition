import bcrypt from "bcrypt"
import { signupInternal } from "../Internal/signupInternal.js"

export const signupService = async (userData) => {
    try {
        const { name, email, password, role } = userData;

        //Call find user service
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await signupInternal({ name, email, passwordHash, role });

        if (!user) {
            throw { status: 500, message: "User creation failed"};
        }

        return user;
    } catch (error) {
        console.error("Error in signupService:", error);
        throw new Error("Error in signup:")
    }
}
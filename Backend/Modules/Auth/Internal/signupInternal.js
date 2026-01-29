import { signupQuery } from "../Query/signupQuery.js"

export const signupInternal = async (userData) => {
    try {
        const { name, email, passwordHash, role } = userData;
        const user = await signupQuery({ name, email, passwordHash, role })
        return user;
    } catch (error) {
        console.error("Error in signupInternal:", error);
        throw new Error("Error in signup:")
    }
}
import { loginQuery } from "../Query/loginQuery.js"

export const loginInternal = async (userData) => {
    try {
        const { email } = userData;
        const user = await loginQuery({ email })
        return user;
    } catch (error) {
        console.error("Error in loginInternal:", error);
        throw new Error("Error in login:")
    }
}
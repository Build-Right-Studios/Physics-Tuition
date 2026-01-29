import User from "../../../MongoDb/User.js"

export const loginQuery = async (userData) => {
    try {
        const { email } = userData;
        const user = await User.findOne({ email });

        return user;
    } catch (error) {
        console.error("Error in loginQuery:", error);
        throw new Error("Error in loginQuery:")
    }
}
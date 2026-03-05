import User from "../../../MongoDb/User.js"

export const signupQuery = async (userData) => {
    try {
        const { name, email, passwordHash, role } = userData;
        const user = new User({ name, email, passwordHash, role });
        const savedUser = await user.save();

        return savedUser.toObject();
    } catch (error) {
        console.error("Error in signupQuery:", error);
        throw new Error("Error in signup:")
    }
}
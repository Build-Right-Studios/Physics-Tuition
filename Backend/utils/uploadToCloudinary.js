import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (filePath, folder, resourceType = "image") => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: resourceType,
        });
        fs.unlinkSync(filePath);
        return {
            url: result.secure_url,
            public_id: result.public_id,
        };
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw { status: 500, message: "Failed to upload file." };
    }
};
import { CLOUDINARY_API_KEY, CLOUDINARY_NAME } from "@/constants/env";
import axios from "axios";

export const upload = async ({ file, folder = "pras/portfolio" }: { file: File, folder?: string }) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const fileName =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(23).substring(2, 5);

    // Generate signature for the original upload
    const signature = await axios.get("/api/cloudinary/signature", {
      params: {
        timestamp: timestamp,
        publicId: fileName,
        folder: folder,
      },
    });

    // Upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    formData.append("public_id", fileName);
    formData.append("timestamp", timestamp.toString());
    formData.append("api_key", CLOUDINARY_API_KEY!);
    formData.append("signature", signature.data.signature);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`,
      formData
    );
    const fileUrl = response.data.secure_url;
    return fileUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

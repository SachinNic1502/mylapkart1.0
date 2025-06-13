import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(file: File, folder = "mylapkart") {
  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: "auto",
            transformation: [{ width: 800, height: 600, crop: "limit" }, { quality: "auto" }, { format: "auto" }],
          },
          (error, result) => {
            if (error) {
              reject(error)
            } else {
              resolve({
                url: result?.secure_url,
                publicId: result?.public_id,
              })
            }
          },
        )
        .end(buffer)
    })
  } catch (error) {
    throw new Error("Failed to upload image")
  }
}

export async function uploadBase64Image(base64: string, folder = "mylapkart/avatars", publicId?: string) {
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    cloudinary.uploader.upload(
      base64,
      {
        folder,
        public_id: publicId,
        overwrite: true,
        transformation: [
          { width: 256, height: 256, crop: "fill" },
          { quality: "auto" },
          { format: "auto" }
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Upload failed"));
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );
  });
}

export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    throw new Error("Failed to delete image")
  }
}

export default cloudinary

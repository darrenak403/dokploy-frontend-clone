import { Area } from "react-easy-crop";

// Tạo một đối tượng hình ảnh từ URL
export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // Cần thiết để tránh lỗi cross-origin
    image.src = url;
  });
export const colors = [
  "foreground",
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
];
// Cắt ảnh dựa trên vùng đã chọn và trả về dưới dạng File
export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<File | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Không thể lấy context của canvas");
  }

  // Đặt kích thước canvas bằng với vùng ảnh được cắt
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Vẽ ảnh đã cắt lên canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Trả về dưới dạng đối tượng File
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(null);
        return;
      }
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      resolve(file);
    }, "image/jpeg");
  });
}

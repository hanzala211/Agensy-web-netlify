import heic2any from "heic2any";

export const isHeicImage = (fileType: string, fileName?: string): boolean => {
  return (
    fileType === "image/heic" ||
    fileType === "image/heif" ||
    (fileName?.toLowerCase().endsWith(".heic") ?? false) ||
    (fileName?.toLowerCase().endsWith(".heif") ?? false)
  );
};

export const convertHeicToJpeg = async (fileUrl: string): Promise<string> => {
  try {
    const response = await fetch(fileUrl);
    const blob = await response.blob();

    const convertedBlob = await heic2any({
      blob,
      toType: "image/jpeg",
      quality: 0.8,
    });
    return URL.createObjectURL(convertedBlob as Blob);
  } catch (error) {
    console.error("Error converting HEIC image:", error);
    throw new Error("Failed to convert HEIC image");
  }
};

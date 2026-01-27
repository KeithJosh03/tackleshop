import axios from "axios";

export interface UploadImageProps {
  file: File;
  originIndex: number;
}

export interface UploadedImageProps {
  url: string;
  originIndex: number;
}

export async function uploadImages(files: UploadImageProps[]) {
  const formData = new FormData();

  files.forEach((item, index) => {
    formData.append(`files[${index}]`, item.file);
    formData.append(`originIndex[${index}]`, String(item.originIndex));
  });


  const response = await axios.post(
    "/api/imageupload/uploads",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.files as UploadedImageProps[];
}

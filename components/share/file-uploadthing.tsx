"use client";

import { useCallback, Dispatch, SetStateAction } from "react";
import type { FileWithPath } from "@uploadthing/react";
import { useDropzone } from "@uploadthing/react/hooks";
import { generateClientDropzoneAccept } from "uploadthing/client";

import { Button } from "@/components/ui/button";
import { convertFileToUrl } from "@/lib/utils";
import Image from "next/image";

type FileUploaderProps = {
  onFieldChange: (url: string) => void;
  imageUrl: string;
  setFiles: Dispatch<SetStateAction<File[]>>;
};

export function FileUploader({
  imageUrl,
  onFieldChange,
  setFiles,
}: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFiles(acceptedFiles);
    onFieldChange(convertFileToUrl(acceptedFiles[0]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*" ? generateClientDropzoneAccept(["image/*"]) : undefined,
  });

  return (
    <div
      {...getRootProps()}
      className="flex-center bg-dark-3 flex h-72 cursor-pointer flex-col overflow-hidden rounded-xl bg-grey-50"
    >
      <input {...getInputProps()} className="cursor-pointer" />

      {imageUrl ? (
        <div className="flex h-full w-full flex-row-reverse  justify-center ">
          <div className="pl-4 flex h-full flex-col items-center   text-grey-500">
            <Image
              src="/icons/upload.svg"
              width={77}
              height={77}
              alt="file upload"
            />
            <h3 className="mb-2 mt-2">Drag photo here</h3>
            <p className="p-medium-12 mb-4">SVG, PNG, JPG</p>
            <Button type="button" className="rounded-full">
              Select from computer
            </Button>
          </div>
          <Image
            src={imageUrl}
            alt="image"
            width={100}
            height={100}
            className="w-[100%] object-contain object-center"
          />
        </div>
      ) : (
        <div className="flex-center flex-col py-5 text-grey-500">
          <Image
            src="/icons/upload.svg"
            width={77}
            height={77}
            alt="file upload"
          />
          <h3 className="mb-2 mt-2">Drag photo here</h3>
          <p className="p-medium-12 mb-4">SVG, PNG, JPG</p>
          <Button type="button" className="rounded-full">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  );
}

// "use client";

// import { UploadDropzone } from "@/lib/uploadthing";
// import { ourFileRouter } from "@/app/api/uploadthing/core";
// import toast from "react-hot-toast";

// interface FileUploadProps {
//   onChange: (url?: string) => void;
//   endpoint: keyof typeof ourFileRouter;
// }

// export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
//   return (
//     <UploadDropzone
//       endpoint={endpoint}
//       onClientUploadComplete={(res) => {
//         onChange(res?.[0].url);
//       }}
//       onUploadError={(error: Error) => {
//         toast.error(`${error?.message}`);
//       }}
//     />
//   );
// };

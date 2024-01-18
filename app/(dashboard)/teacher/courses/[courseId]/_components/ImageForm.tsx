"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FileUploader } from "@/components/share/file-uploadthing";
import { useUploadThing } from "@/lib/uploadthing";

const formSchema = z.object({
  imageUrl: z.string().min(2, {
    message: "Image is required and  must be at least 2 characters.",
  }),
});

type ImageFormProps = {
  initialData: {
    imageUrl: string | null;
  };
  courseId: string;
};

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("imageUploader");
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => {
    setIsEditing((current) => !current);
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: initialData?.imageUrl || "",
    },
  });
  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let uploadedImageUrl = values.imageUrl;
    if (files.length > 0) {
      const uploadedImages = await startUpload(files);

      if (!uploadedImages) {
        return;
      }

      uploadedImageUrl = uploadedImages[0].url;
    }

    try {
      await axios.patch(`/api/courses/${courseId}`, {
        ...values,
        imageUrl: uploadedImageUrl,
      });
      toast.success("Course updated successfully");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
    console.log(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
          {/* <div className="font-medium flex items-center justify-between">
            Course Image
            <Button onClick={toggleEdit} variant={"ghost"}>
              {isEditing && <>Cancel</>}
              {!isEditing && !initialData.imageUrl && (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                </>
              )}
              {!isEditing && (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Image
                </>
              )}
            </Button>
          </div> */}
          {/* {!isEditing &&
            (!initialData.imageUrl ? (
              <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                <ImageIcon className="h-10 w-10 text-slate-500" />
              </div>
            ) : (
              <div className="relative aspect-video mt-2">
                <Image
                  alt="Upload"
                  fill
                  className="object-cover rounded-md"
                  src={initialData.imageUrl}
                />
              </div>
            ))} */}
          {/* {isEditing && ( */}
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrl={field.value}
                    setFiles={setFiles}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* )} */}
        </div>
        <div className="flex items-center gap-x-2">
          <Button disabled={!isValid || isSubmitting} type="submit">
            Submit the Image
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ImageForm;

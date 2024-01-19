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
import { Attachment, Course } from "@prisma/client";
import { File, Loader2, X } from "lucide-react";

const formSchema = z.object({
  url: z.string().min(1),
});

type AttachmentFormProps = {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
};

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("imageUploader");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const toggleEdit = () => {
    setIsEditing((current) => !current);
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: initialData?.attachments[1]?.url || "",
    },
  });
  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsChecking(true);
    let uploadedImageUrl = values.url;
    if (files.length > 0) {
      const uploadedImages = await startUpload(files);

      if (!uploadedImages) {
        setIsChecking(false);
        return;
      }

      uploadedImageUrl = uploadedImages[0].url;
    }

    try {
      await axios.post(`/api/courses/${courseId}/attachments`, {
        ...values,
        imageUrl: uploadedImageUrl,
      });
      toast.success("Course updated successfully");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Attachment Deleted");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };
  console.log("egfeggesgsgsg", { initialData });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
          {!isEditing && (
            <>
              {initialData.attachments.length === 0 && (
                <p className="text-sm mt-2 text-slate-500">No Attachements</p>
              )}

              {initialData.attachments.length > 0 && (
                <div className="space-y-2">
                  {initialData.attachments.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                    >
                      <File className="h-4 w-4 mr-2 flex-shrink-0" />
                      <p>{item.name}</p>
                      {deletingId === item.id && (
                        <div>
                          <Loader2 className="h4 w-4 animate-spin" />
                        </div>
                      )}
                      {deletingId !== item.id && (
                        <button
                          onClick={() => onDelete(item.id)}
                          className="ml-auto hover:opacity-75 transition"
                        >
                          <X className="h4 w-4 " />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <Button onClick={() => setIsOpen((prev) => !prev)}>
            {!isOpen ? <p>Add Attachment</p> : <p>Cancel</p>}
          </Button>

          {isOpen && (
            <FormField
              control={form.control}
              name="url"
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
          )}
        </div>
        <p className="text-sm text-slate-500 ">
          Add anything that your students might need to complete
        </p>
        <div className="flex items-center gap-x-2">
          <Button disabled={!isValid || isSubmitting} type="submit">
            Submit the Attachments
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AttachmentForm;

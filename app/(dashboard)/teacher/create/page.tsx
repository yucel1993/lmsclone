"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title is required and  must be at least 2 characters.",
  }),
});

export default function CreateForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    try {
      const response = await axios.post("/api/course", values);
      router.push(`/teacher/courses/${response.data.id}`);
      toast.success("Course created successfully");
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  }

  const { isSubmitting, isValid } = form.formState;

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center flex-col h-full p-6">
      <div>
        <h1 className="text-2xl">Name Your Course</h1>
        <p className="text-sm text-slate-600">
          What would you like to name your course ? Don&apos;t worry, you can
          change it later
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Title</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="e.g. 'Advanced web development'"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  What will you teach in this course ?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-x-2">
            <Link href={"/"}>
              <Button variant={"ghost"} type="button">
                Cancel
              </Button>
            </Link>
            <Button disabled={!isValid || isSubmitting} type="submit">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useBooksStore } from "@/store/books.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetIcon } from "@radix-ui/react-icons";
import { SearchIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const searchFormSchema = z.object({
  title: z.string().max(30).optional(),
  author: z.string().max(30).optional(),
});

export const BookSearch = () => {
  const { fetchBooks } = useBooksStore();

  const form = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      title: "",
      author: "",
    },
  });

  const onSubmit = (values: z.infer<typeof searchFormSchema>) => {
    if (!values.title && !values.author) {
      toast.error("Please enter at least one search term");
      // set error to any field to avoid showing reset button
      form.setError("title", {
        message: "Please enter at least one search term",
      });
      return;
    }
    try {
      fetchBooks({ title: values.title, author: values.author });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onReset = () => {
    form.reset();
    try {
      fetchBooks();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-4 flex flex-col items-center gap-2 sm:flex-row">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full sm:w-max">
                <FormControl>
                  <Input
                    placeholder="Search book name..."
                    className="sm:max-w-64"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem className="w-full sm:w-max">
                <FormControl>
                  <Input
                    placeholder="Author name"
                    className="sm:max-w-44"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button className="w-full sm:w-max">
            <SearchIcon className="size-5" />
            <span className="sr-only">Search</span>
          </Button>
          {form.formState.isValid && form.formState.isSubmitted && (
            <Button
              type="reset"
              className="w-full text-xs sm:w-max"
              variant={"ghost"}
              size={"sm"}
              onClick={onReset}
            >
              <ResetIcon className="size-2" />
              <span>Reset search</span>
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

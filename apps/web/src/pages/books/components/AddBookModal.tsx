import { useBooksPageState } from "../books-page.state";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useBooksStore } from "@/store/books.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const addBookFormSchema = z.object({
  title: z.string().min(2).max(100),
  authors: z.string().min(2).max(100),
  isbn: z.preprocess((val) => Number(val), z.number()),
  isbn13: z.preprocess((val) => Number(val), z.number()),
  language_code: z.string().min(2).max(8),
  average_rating: z.preprocess((val) => Number(val), z.number()),
  num_pages: z.preprocess((val) => Number(val), z.number()),
  ratings_count: z.preprocess((val) => Number(val), z.number()),
  text_reviews_count: z.preprocess((val) => Number(val), z.number()),
  publication_date: z.date(),
  publisher: z.string().min(2).max(100),
  rent_fee: z.preprocess((val) => Number(val), z.number()),
});

export const AddBookModal = () => {
  const { isAddBookModalOpen, setIsAddBookModalOpen } = useBooksPageState();
  const { createBook } = useBooksStore();

  const form = useForm<z.infer<typeof addBookFormSchema>>({
    resolver: zodResolver(addBookFormSchema),
    defaultValues: {
      title: "",
      authors: "",
      isbn: 0,
      isbn13: 0,
      language_code: "",
      average_rating: 0,
      num_pages: 0,
      ratings_count: 0,
      text_reviews_count: 0,
      publication_date: new Date(),
      publisher: "",
      rent_fee: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof addBookFormSchema>) => {
    const loadingToastId = toast.loading("Creating book...");
    await createBook({
      ...values,
      id: 0,
      publication_date: values.publication_date.toISOString(),
    });
    form.reset();
    form.reset();
    toast.success("Book created successfully", { id: loadingToastId });
    setIsAddBookModalOpen(false);
  };

  return (
    <Dialog open={isAddBookModalOpen} onOpenChange={setIsAddBookModalOpen}>
      <DialogContent
        className="max-h-screen overflow-auto md:max-w-[600px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add book</DialogTitle>
          <Separator />
        </DialogHeader>
        <div className="text-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="authors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Authors</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="publisher"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publisher</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="isbn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ISBN</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isbn13"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ISBN13</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="language_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language code</FormLabel>
                      <FormControl>
                        <Input placeholder="eng, hin, mar" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="publication_date"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Publication date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                              type="button"
                            >
                              {form.getValues("publication_date") ? (
                                format(
                                  form.getValues("publication_date"),
                                  "PPP",
                                )
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="num_pages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of pages</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rent_fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rent fee per day</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid sm:grid-cols-3 sm:gap-4">
                <FormField
                  control={form.control}
                  name="average_rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average rating</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-4 sm:mt-0">
                  <FormField
                    control={form.control}
                    name="ratings_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ratings count</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <br className="-mt-4 block sm:hidden" />
                <FormField
                  control={form.control}
                  name="text_reviews_count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Text reviews count</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Submit
                </Button>
                <Button
                  type="reset"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

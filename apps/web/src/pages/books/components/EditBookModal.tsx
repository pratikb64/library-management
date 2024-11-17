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

const editBookFormSchema = z.object({
  title: z.string().min(2).max(500),
  authors: z.string().min(2).max(500),
  isbn: z.preprocess((val) => Number(val), z.number()),
  isbn13: z.preprocess((val) => Number(val), z.number()),
  language_code: z.string().min(2).max(8),
  average_rating: z.preprocess((val) => Number(val), z.number()),
  num_pages: z.preprocess((val) => Number(val), z.number()),
  ratings_count: z.preprocess((val) => Number(val), z.number()),
  text_reviews_count: z.preprocess((val) => Number(val), z.number()),
  publication_date: z.date(),
  publisher: z.string().min(2).max(500),
  rent_fee: z.preprocess((val) => Number(val), z.number()),
  quantity: z.preprocess((val) => Number(val), z.number()),
});

export const EditBookModal = () => {
  const { editBookData, setEditBookModalData } = useBooksPageState();
  const { updateBook } = useBooksStore();
  const form = useForm<z.infer<typeof editBookFormSchema>>({
    resolver: zodResolver(editBookFormSchema),
    values: {
      title: editBookData?.book?.title || "",
      authors: editBookData?.book?.authors || "",
      isbn: editBookData?.book?.isbn || 0,
      isbn13: editBookData?.book?.isbn13 || 0,
      language_code: editBookData?.book?.language_code || "",
      average_rating: editBookData?.book?.average_rating || 0,
      num_pages: editBookData?.book?.num_pages || 0,
      ratings_count: editBookData?.book?.ratings_count || 0,
      text_reviews_count: editBookData?.book?.text_reviews_count || 0,
      publication_date: new Date(
        editBookData?.book?.publication_date || new Date(),
      ),
      publisher: editBookData?.book?.publisher || "",
      rent_fee: editBookData?.book?.rent_fee || 0,
      quantity: editBookData?.book?.quantity || 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof editBookFormSchema>) => {
    if (!editBookData?.book?.id) {
      toast.error("Something went wrong");
      return;
    }

    const loadingToastId = toast.loading("Updating book...");

    try {
      const changedFields = Object.keys(form.formState.dirtyFields).reduce(
        (acc, key) => ({
          ...acc,
          [key]: values[key as keyof z.infer<typeof editBookFormSchema>],
        }),
        {},
      );

      await updateBook(editBookData.book.id, changedFields);
      toast.success("Book updated successfully", { id: loadingToastId });

      setEditBookModalData({
        isEditBookModalOpen: false,
        book: undefined,
      });
    } catch (error) {
      toast.error("Something went wrong", { id: loadingToastId });
    }
  };

  return (
    <Dialog
      open={editBookData?.isEditBookModalOpen}
      onOpenChange={(open) =>
        setEditBookModalData({
          isEditBookModalOpen: open,
          book: editBookData?.book,
        })
      }
    >
      <DialogContent
        className="max-h-screen overflow-auto md:max-w-[600px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Edit book</DialogTitle>
          <Separator />
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-5xl space-y-4"
          >
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
                              format(form.getValues("publication_date"), "PPP")
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
            <div className="grid grid-cols-2 gap-4">
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
            <div className="grid grid-cols-2 gap-4">
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
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="flex flex-col gap-2 sm:flex-row">
              <Button type="submit" disabled={!form.formState.isDirty}>
                Save changes
              </Button>
              <Button
                type="reset"
                variant="outline"
                onClick={() => form.reset()}
                disabled={!form.formState.isDirty}
              >
                Reset changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

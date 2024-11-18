import { useBooksPageState } from "../books-page.state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useBooksStore } from "@/store/books.store";
import { AsyncState } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const importBooksFormSchema = z.object({
  title: z.string().max(50).optional(),
  no_of_books: z.preprocess((val) => Number(val), z.number()),
});

export const ImportBooksModal = () => {
  const { isImportBooksModalOpen, setIsImportBooksModalOpen } =
    useBooksPageState();
  const { importBooks, asyncStates } = useBooksStore();

  const form = useForm<z.infer<typeof importBooksFormSchema>>({
    resolver: zodResolver(importBooksFormSchema),
    defaultValues: {
      title: "",
      no_of_books: 10,
    },
  });

  const onSubmit = async (values: z.infer<typeof importBooksFormSchema>) => {
    try {
      await importBooks({
        title: values.title,
        no_of_books: values.no_of_books,
      });
      toast.success("Books imported successfully");
      setIsImportBooksModalOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onOpenChange = (isOpen: boolean) => {
    if (asyncStates.importBooksAsyncState === AsyncState.Pending) return;
    setIsImportBooksModalOpen(isOpen);
  };

  return (
    <Dialog open={isImportBooksModalOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-screen overflow-auto md:max-w-[400px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Import books</DialogTitle>
          <DialogDescription className="text-xs">
            Import books will take some time, please wait after submitting
          </DialogDescription>
        </DialogHeader>
        <div className="text-sm">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-2 space-y-6"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Search title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      The title of the book(s) to import
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="no_of_books"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of books to import</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                {asyncStates.importBooksAsyncState !== AsyncState.Pending && (
                  <Button type="submit">Submit</Button>
                )}
                {asyncStates.importBooksAsyncState === AsyncState.Pending && (
                  <Button disabled>
                    <Loader2 className="animate-spin" />
                    Importing
                  </Button>
                )}
                <Button
                  type="reset"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={
                    asyncStates.importBooksAsyncState === AsyncState.Pending
                  }
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

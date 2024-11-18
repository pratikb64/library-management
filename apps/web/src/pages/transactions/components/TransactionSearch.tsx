import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTransactionsStore } from "@/store/transactions.store";
import { AsyncState } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetIcon } from "@radix-ui/react-icons";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const searchFormSchema = z.object({
  member_id: z.preprocess((val) => Number(val), z.number()),
  member_first_name: z.string().max(30).optional(),
  member_last_name: z.string().max(30).optional(),
  book_title: z.string().max(30).optional(),
  book_id: z.preprocess((val) => Number(val), z.number()),
});

export const TransactionSearch = () => {
  const { fetchTransactions, asyncStates } = useTransactionsStore();
  const [isMemberFilterOpen, setIsMemberFilterOpen] = useState(false);
  const [isBookFilterOpen, setIsBookFilterOpen] = useState(false);

  const form = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      member_id: "" as unknown as number,
      member_first_name: "",
      member_last_name: "",
      book_id: "" as unknown as number,
      book_title: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof searchFormSchema>) => {
    if (
      !values.member_first_name &&
      !values.member_last_name &&
      !values.member_id &&
      !values.book_title &&
      !values.book_id
    ) {
      toast.error("Please enter at least one search term");
      // set error to any field to avoid showing reset button
      form.setError("member_first_name", {
        message: "Please enter at least one search term",
      });
      return;
    }
    try {
      await fetchTransactions(values);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onReset = () => {
    form.reset();
    fetchTransactions();
  };

  const member_first_name = form.watch("member_first_name");
  const member_last_name = form.watch("member_last_name");
  const member_id = form.watch("member_id");
  const book_title = form.watch("book_title");
  const book_id = form.watch("book_id");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-4 flex flex-col items-center gap-2 sm:flex-row">
          <DropdownMenu
            onOpenChange={setIsMemberFilterOpen}
            open={isMemberFilterOpen}
            modal={false}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                type="button"
                className="w-full text-gray-700 sm:w-max"
              >
                {member_first_name || member_last_name || member_id ? (
                  <div>
                    {`${member_first_name} ${member_last_name} ${member_id ? `- ${member_id}` : ""}`}
                  </div>
                ) : (
                  <span>Open Member Filters</span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <div className="flex flex-col gap-3 p-2">
                <FormField
                  control={form.control}
                  name="member_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Member Id</FormLabel>
                      <FormControl className="!mt-1">
                        <Input
                          placeholder="Member Id"
                          type="number"
                          onFocus={(e) => e.target.select()}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="member_first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">First name</FormLabel>
                      <FormControl className="!mt-1">
                        <Input placeholder="First name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="member_last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Last name</FormLabel>
                      <FormControl className="!mt-1">
                        <Input placeholder="Last name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu
            onOpenChange={setIsBookFilterOpen}
            open={isBookFilterOpen}
            modal={false}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                type="button"
                className="w-full text-gray-700 sm:w-max"
              >
                {book_title || book_id ? (
                  <div>{`${book_title} ${book_id ? `- ${book_id}` : ""}`}</div>
                ) : (
                  <span>Open Book Filters</span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <div className="flex flex-col gap-3 p-2">
                <FormField
                  control={form.control}
                  name="book_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Book Id</FormLabel>
                      <FormControl className="!mt-1">
                        <Input
                          placeholder="Book Id"
                          type="number"
                          onFocus={(e) => e.target.select()}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="book_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Book Title</FormLabel>
                      <FormControl className="!mt-1">
                        <Input placeholder="Book Title" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            className="w-full sm:w-max"
            disabled={
              asyncStates.fetchTransactionsAsyncState === AsyncState.Pending
            }
          >
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
              disabled={
                asyncStates.fetchTransactionsAsyncState === AsyncState.Pending
              }
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

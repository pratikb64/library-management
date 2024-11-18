import { useTransactionsPageState } from "../transactions-page.state";
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
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useTransactionsStore } from "@/store/transactions.store";
import { AsyncState, TransactionStatus } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const editTransactionFormSchema = z.object({
  issue_date: z.date(),
  return_date: z.date().optional(),
  status: z.nativeEnum(TransactionStatus),
  fee_charged: z.preprocess((val) => Number(val), z.number()).optional(),
});

export const EditTransactionModal = () => {
  const { editTransactionData, setEditTransactionModalData } =
    useTransactionsPageState();
  const { updateTransaction, asyncStates } = useTransactionsStore();

  const form = useForm<z.infer<typeof editTransactionFormSchema>>({
    resolver: zodResolver(editTransactionFormSchema),
    defaultValues: {
      fee_charged: editTransactionData?.transaction?.fee_charged,
      issue_date: new Date(
        editTransactionData?.transaction?.issue_date || new Date(),
      ),
      return_date: editTransactionData?.transaction?.return_date
        ? new Date(editTransactionData?.transaction?.return_date)
        : undefined,
      status: editTransactionData?.transaction?.status,
    },
    shouldUnregister: true,
  });

  const onSubmit = async (
    values: z.infer<typeof editTransactionFormSchema>,
  ) => {
    if (!editTransactionData?.transaction?.id) {
      toast.error("Something went wrong");
      return;
    }
    const loadingToastId = toast.loading("Updating book...");

    try {
      await updateTransaction(editTransactionData.transaction.id, {
        issue_date: format(values.issue_date, "MM/dd/yyyy"),
        return_date: values.return_date
          ? format(values.return_date, "yyyy-MM-dd")
          : null,
        status: values.status,
        fee_charged: values.fee_charged,
      });
      toast.success("Book updated successfully", { id: loadingToastId });

      setEditTransactionModalData({
        isEditTransactionModalOpen: false,
        transaction: undefined,
      });
    } catch (error) {
      toast.error("Something went wrong", { id: loadingToastId });
    }
  };

  const onOpenChange = (isOpen: boolean) => {
    if (asyncStates.updateTransactionAsyncState === AsyncState.Pending) return;
    setEditTransactionModalData({
      isEditTransactionModalOpen: isOpen,
      transaction: undefined,
    });
    form.reset();
  };

  return (
    <Dialog
      open={editTransactionData?.isEditTransactionModalOpen}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="max-h-screen overflow-auto md:max-w-sm"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <Separator />
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-5xl space-y-4"
          >
            <div>
              <Label>Member</Label>
              <Input
                type="text"
                value={editTransactionData?.transaction?.member.first_name}
                readOnly
              />
            </div>
            <div>
              <Label>Book</Label>
              <Input
                type="text"
                value={editTransactionData?.transaction?.book.title}
                readOnly
              />
            </div>
            <FormField
              control={form.control}
              name="issue_date"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Issue date</FormLabel>
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
                          {form.getValues("issue_date") ? (
                            format(form.getValues("issue_date"), "PPP")
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
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="return_date"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Return date</FormLabel>
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
                          {form.getValues("return_date") ? (
                            format(
                              form.getValues("return_date") || new Date(),
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
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={TransactionStatus.ISSUED}>
                        Issued
                      </SelectItem>
                      <SelectItem value={TransactionStatus.RETURNED}>
                        Returned
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fee_charged"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fee charged</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter fee charged"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="submit"
                disabled={
                  !form.formState.isDirty ||
                  asyncStates.updateTransactionAsyncState === AsyncState.Pending
                }
              >
                Save changes
              </Button>
              <Button
                type="reset"
                variant="outline"
                onClick={() => form.reset()}
                disabled={
                  !form.formState.isDirty ||
                  asyncStates.updateTransactionAsyncState === AsyncState.Pending
                }
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

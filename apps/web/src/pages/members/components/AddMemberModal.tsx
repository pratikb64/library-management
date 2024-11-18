import { useMembersPageState } from "../members-page.state";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import { useMembersStore } from "@/store/members.store";
import { AsyncState } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const addMemberFormSchema = z.object({
  first_name: z.string().min(2).max(30),
  last_name: z.string().min(2).max(30),
  email: z.string().email(),
});

export const AddMemberModal = () => {
  const { isAddMemberModalOpen, setIsAddMemberModalOpen } =
    useMembersPageState();
  const { createMember, asyncStates } = useMembersStore();

  const form = useForm<z.infer<typeof addMemberFormSchema>>({
    resolver: zodResolver(addMemberFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof addMemberFormSchema>) => {
    const loadingToastId = toast.loading("Creating member...");
    try {
      await createMember(values);
      form.reset();
      toast.success("Member created successfully", { id: loadingToastId });
      setIsAddMemberModalOpen(false);
    } catch (error) {
      toast.error("Something went wrong", { id: loadingToastId });
    }
  };

  const onOpenChange = (isOpen: boolean) => {
    if (asyncStates.createMemberAsyncState === AsyncState.Pending) return;
    setIsAddMemberModalOpen(isOpen);
  };

  return (
    <Dialog open={isAddMemberModalOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-screen overflow-auto md:max-w-sm"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add member</DialogTitle>
          <Separator />
        </DialogHeader>
        <div className="text-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="submit"
                  disabled={
                    asyncStates.createMemberAsyncState === AsyncState.Pending
                  }
                >
                  Submit
                </Button>
                <Button
                  type="reset"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={
                    asyncStates.createMemberAsyncState === AsyncState.Pending
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

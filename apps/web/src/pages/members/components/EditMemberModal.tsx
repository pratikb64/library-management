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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const editMemberFormSchema = z.object({
  first_name: z.string().min(2).max(30),
  last_name: z.string().min(2).max(30),
  email: z.string().email(),
});

export const EditMemberModal = () => {
  const { editMemberData, setEditMemberModalData } = useMembersPageState();
  const { updateMember } = useMembersStore();

  const form = useForm<z.infer<typeof editMemberFormSchema>>({
    resolver: zodResolver(editMemberFormSchema),
    values: {
      first_name: editMemberData?.member?.first_name || "",
      last_name: editMemberData?.member?.last_name || "",
      email: editMemberData?.member?.email || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof editMemberFormSchema>) => {
    if (!editMemberData?.member?.id) {
      toast.error("Something went wrong");
      return;
    }
    const loadingToastId = toast.loading("Updating book...");

    try {
      const changedFields = Object.keys(form.formState.dirtyFields).reduce(
        (acc, key) => ({
          ...acc,
          [key]: values[key as keyof z.infer<typeof editMemberFormSchema>],
        }),
        {},
      );

      await updateMember(editMemberData.member.id, changedFields);
      toast.success("Book updated successfully", { id: loadingToastId });

      setEditMemberModalData({
        isEditMemberModalOpen: false,
        member: undefined,
      });
    } catch (error) {
      toast.error("Something went wrong", { id: loadingToastId });
    }
  };

  return (
    <Dialog
      open={editMemberData?.isEditMemberModalOpen}
      onOpenChange={(open) => {
        setEditMemberModalData({
          isEditMemberModalOpen: open,
          member: undefined,
        });
      }}
    >
      <DialogContent
        className="max-h-screen overflow-auto md:max-w-sm"
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
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
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
                  <FormLabel>Last name</FormLabel>
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

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMembersStore } from "@/store/members.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetIcon } from "@radix-ui/react-icons";
import { SearchIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const searchFormSchema = z.object({
  first_name: z.string().max(30).optional(),
  last_name: z.string().max(30).optional(),
  email: z.string().max(50).optional(),
});

export const MemberSearch = () => {
  const { fetchMembers } = useMembersStore();
  const form = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof searchFormSchema>) => {
    if (!values.first_name && !values.last_name && !values.email) {
      toast.error("Please enter at least one search term");
      // set error to any field to avoid showing reset button
      form.setError("first_name", {
        message: "Please enter at least one search term",
      });
      return;
    }
    try {
      fetchMembers({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
      });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onReset = () => {
    form.reset();
    fetchMembers();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-4 flex flex-col items-center gap-2 sm:flex-row">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem className="w-full sm:w-max">
                <FormControl>
                  <Input
                    placeholder="First name"
                    className="sm:max-w-64"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem className="w-full sm:w-max">
                <FormControl>
                  <Input
                    placeholder="Last name"
                    className="sm:max-w-44"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full sm:w-max">
                <FormControl>
                  <Input
                    placeholder="Email"
                    className="sm:max-w-64"
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

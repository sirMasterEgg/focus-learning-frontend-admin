import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Plus, Save, Send } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import RichTextEditor from "@/components/rich-text-editor.tsx";
import CurrencyInput from "@/components/amount-input.tsx";
import { z } from "zod";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateDonationMutation } from "@/api/core/donations/create-donations.api.ts";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store.ts";
import { useToast } from "@/hooks/use-toast.ts";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DONATION_QUERY_KEY } from "@/api/core/donations/get-donations.api.ts";

const addFormSchema = z.object({
  program_name: z.string().min(1, {
    message: "Program name is required",
  }),
  recipient_name: z.string().min(1, {
    message: "Recipient name is required",
  }),
  thumbnail: z
    .instanceof(File, {
      message: "Thumbnail is required",
    })
    .refine((file) => file.size < 10000000, {
      message: "Your thumbnail must be less than 10MB.",
    })
    .refine((file) => file.type.startsWith("image/"), {
      message: "Your thumbnail must be an image",
    }),
  program_image: z
    .instanceof(File, {
      message: "Program image is required",
    })
    .refine((file) => file.size < 10000000, {
      message: "Your program image must be less than 10MB.",
    })
    .refine((file) => file.type.startsWith("image/"), {
      message: "Your program image must be an image",
    }),
  description: z.string().min(1, {
    message: "Description is required",
  }),
  target_amount: z.number().min(1, {
    message: "Target amount must be greater than 0",
  }),
});

export default function CreateDonationProgram() {
  const auth = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();
  const [modalCreate, setModalCreate] = useState<boolean>(false);
  const addForm = useForm<z.infer<typeof addFormSchema>>({
    resolver: zodResolver(addFormSchema),
    defaultValues: {
      program_name: "",
      recipient_name: "",
      thumbnail: undefined,
      program_image: undefined,
      description: "",
      target_amount: 0,
    },
    mode: "onChange",
  });
  const createDonationMutation = useCreateDonationMutation();
  const queryClient = useQueryClient();

  function onSubmit(values: z.infer<typeof addFormSchema>, isActive: boolean) {
    const formData = new FormData();

    formData.append("title", values.program_name);
    formData.append("recipient", values.recipient_name);
    formData.append("description", values.description);
    formData.append("thumbnail", values.thumbnail);
    formData.append("program_image", values.program_image);
    formData.append("target", values.target_amount.toString());
    formData.append("is_active", isActive ? "1" : "0");

    createDonationMutation.mutate([auth.token || "", formData], {
      onSuccess: () => {
        addForm.reset();
        setModalCreate(false);

        queryClient.invalidateQueries({
          queryKey: [DONATION_QUERY_KEY],
        });

        toast({
          variant: "default",
          description: "Donation program has been created",
        });
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          if (
            error?.response?.status &&
            error.response?.status >= 400 &&
            error.response?.status < 500
          ) {
            toast({
              variant: "destructive",
              description: error.response.data.message,
            });
          } else if (error?.response?.status && error.response?.status >= 500) {
            toast({
              variant: "destructive",
              description: "Something went wrong, please try again later",
            });
          }
        }
      },
    });
  }

  function onSubmitSave(values: z.infer<typeof addFormSchema>) {
    onSubmit(values, false);
  }

  function onSubmitSaveAndPublish(values: z.infer<typeof addFormSchema>) {
    onSubmit(values, true);
  }

  function handleModalStateChange(open: boolean) {
    setModalCreate(open);
    addForm.reset();
  }

  return (
    <>
      <Dialog open={modalCreate} onOpenChange={handleModalStateChange}>
        <DialogTrigger asChild>
          <Button>
            <Plus />
            Create Program
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[calc(100vh_-_8rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Program</DialogTitle>
            <DialogDescription>
              Fill out the details below to launch a new donation program.
            </DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form
              onSubmit={addForm.handleSubmit(onSubmitSave)}
              className="space-y-2"
            >
              <FormField
                control={addForm.control}
                name="program_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Write program name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="recipient_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Write recipient name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="thumbnail"
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        type="file"
                        placeholder="Choose an image to represent the program (thumbnail)"
                        accept="image/*"
                        onChange={(event) =>
                          onChange(event.target.files && event.target.files[0])
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="program_image"
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Program Image</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        type="file"
                        placeholder="Choose an image to represent the program"
                        accept="image/*"
                        onChange={(event) =>
                          onChange(event.target.files && event.target.files[0])
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="description"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        placeholder="Write a description"
                        value={value}
                        onChange={onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="target_amount"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Target Amount</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        onChange={(value) => onChange(Number(value))}
                        value={value.toString()}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="inline-flex flex-row gap-2 pt-2">
                <Button
                  disabled={!addForm.formState.isValid}
                  type="submit"
                  variant="secondary"
                >
                  <Save /> Save
                </Button>
                <Button
                  disabled={!addForm.formState.isValid}
                  onClick={addForm.handleSubmit(onSubmitSaveAndPublish)}
                  type="button"
                >
                  <Send /> Save & Activate
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

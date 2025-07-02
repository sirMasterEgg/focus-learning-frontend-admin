import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DonationListTable } from "@/types/table-donation-program.tsx";
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
import { Button } from "@/components/ui/button.tsx";
import { Save, SquarePen, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx";
import { useDeleteDonationMutation } from "@/api/core/donations/delete-donations.api.ts";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast.ts";
import { AxiosError } from "axios";
import { DONATION_QUERY_KEY } from "@/api/core/donations/get-donations.api.ts";
import { useEffect, useState } from "react";
import { useUpdateDonationMutation } from "@/api/core/donations/update-donations.api.ts";
import { RootState } from "@/stores/store.ts";

type DonationActionModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  donation: DonationListTable | null;
  actionType: "view" | "edit" | "delete" | "";
};

type ModalProps = {
  donation: DonationListTable;
  onOpenChange: (open: boolean) => void;
};

const viewFormSchema = z.object({
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
    })
    .optional(),
  program_image: z
    .instanceof(File, {
      message: "Program image is required",
    })
    .refine((file) => file.size < 10000000, {
      message: "Your program image must be less than 10MB.",
    })
    .refine((file) => file.type.startsWith("image/"), {
      message: "Your program image must be an image",
    })
    .optional(),
  description: z.string().min(1, {
    message: "Description is required",
  }),
  target_amount: z.number().min(1, {
    message: "Target amount must be greater than 0",
  }),
});

const ViewDialog = ({
  donation,
  onOpenChange,
  parentModalOpen,
}: ModalProps & { parentModalOpen: boolean }) => {
  return (
    <>
      <EditDialog
        donation={donation}
        onOpenChange={onOpenChange}
        editable={false}
        parentModalOpen={parentModalOpen}
      />
    </>
  );
};

const EditDialog = ({
  donation,
  onOpenChange,
  editable = true,
  parentModalOpen,
}: ModalProps & { editable?: boolean; parentModalOpen: boolean }) => {
  const [isEditable, setIsEditable] = useState<boolean>(editable);
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!parentModalOpen) {
      setIsEditable(editable);
      viewForm.reset({
        program_name: donation.title,
        recipient_name: donation.recipient,
        thumbnail: undefined,
        program_image: undefined,
        description: donation.description,
        target_amount: donation.target,
      });
    }
  }, [parentModalOpen, editable]);

  const viewForm = useForm<z.infer<typeof viewFormSchema>>({
    resolver: zodResolver(viewFormSchema),
    defaultValues: {
      program_name: donation.title,
      recipient_name: donation.recipient,
      thumbnail: undefined,
      program_image: undefined,
      description: donation.description,
      target_amount: donation.target,
    },
    mode: "onChange",
  });

  const updateDonation = useUpdateDonationMutation();
  const queryClient = useQueryClient();

  const handleEditDonation = (data: z.infer<typeof viewFormSchema>) => {
    const formdata = new FormData();

    formdata.append("title", data.program_name);
    formdata.append("recipient", data.recipient_name);
    formdata.append("description", data.description);
    formdata.append("target", data.target_amount.toString());

    if (data.thumbnail instanceof File) {
      formdata.append("thumbnail", data.thumbnail);
    }
    if (data.program_image instanceof File) {
      formdata.append("program_image", data.program_image);
    }

    updateDonation.mutate(
      [auth.token as string, donation.human_readable_id, formdata],
      {
        onSuccess: () => {
          toast({
            description: "Donation program updated successfully",
          });
          queryClient
            .invalidateQueries({
              queryKey: [DONATION_QUERY_KEY],
            })
            .then(() => {
              onOpenChange(false);
            });
        },
        onError: () => {
          toast({
            variant: "destructive",
            description: "Failed to update donation program",
          });
        },
      }
    );
  };

  return (
    <>
      <DialogContent className="max-h-[calc(100vh_-_8rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditable ? "Edit Donation Program" : "View Donation Program"}
          </DialogTitle>
          <DialogDescription>
            {isEditable
              ? "Update the donation details below."
              : "Review the details of the donation program below. Please verify the information is accurate."}
          </DialogDescription>
        </DialogHeader>
        <Form {...viewForm}>
          <form className="space-y-2">
            <FormField
              control={viewForm.control}
              name="program_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Write program name"
                      {...field}
                      disabled={!isEditable}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={viewForm.control}
              name="recipient_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Write recipient name"
                      {...field}
                      disabled={!isEditable}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={viewForm.control}
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
                      disabled={!isEditable}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={viewForm.control}
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
                      disabled={!isEditable}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={viewForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      placeholder="Write a description"
                      value={field.value || ""}
                      onChange={field.onChange}
                      readOnly={!isEditable}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={viewForm.control}
              name="target_amount"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Target Amount</FormLabel>
                  <FormControl>
                    <CurrencyInput
                      onChange={(value) => onChange(Number(value))}
                      value={value?.toString() || ""}
                      disabled={!isEditable}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="inline-flex flex-row gap-2 pt-2">
              {isEditable ? (
                <Button
                  type="button"
                  onClick={viewForm.handleSubmit(handleEditDonation)}
                >
                  <Save /> Save Edit
                </Button>
              ) : (
                <Button type="button" onClick={() => setIsEditable(true)}>
                  <SquarePen /> Edit Program
                </Button>
              )}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    className="bg-white text-destructive border border-destructive hover:bg-destructive/10 hover:border-destructive"
                  >
                    <Trash2 /> Delete Program
                  </Button>
                </AlertDialogTrigger>
                <DeleteDialog donation={donation} onOpenChange={onOpenChange} />
              </AlertDialog>
            </div>
          </form>
        </Form>
      </DialogContent>
    </>
  );
};

const DeleteDialog = ({ donation, onOpenChange }: ModalProps) => {
  const deleteMutation = useDeleteDonationMutation();
  const auth = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();

  const handleDeleteDonation = () => {
    deleteMutation.mutate([auth.token as string, donation.human_readable_id], {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [DONATION_QUERY_KEY],
        });
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast({
            variant: "destructive",
            description: error.response?.data.message,
          });
        }
      },
      onSettled: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You’re about to delete "{donation.title}" from the donation program
            list. Once you continue it will be permanently removed from the
            database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No, Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDeleteDonation()}>
            Yes, Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </>
  );
};

export function DonationActionModal({
  isOpen,
  onOpenChange,
  donation,
  actionType,
}: DonationActionModalProps) {
  if (!donation) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange} key="no-donation">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>
              <span>
                <strong>Error:</strong> No donation selected
              </span>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      {actionType === "delete" ? (
        <AlertDialog
          open={isOpen}
          onOpenChange={onOpenChange}
          key={donation ? donation.id : "no-donation"}
        >
          <DeleteDialog donation={donation} onOpenChange={onOpenChange} />
        </AlertDialog>
      ) : (
        <Dialog
          open={isOpen}
          onOpenChange={onOpenChange}
          key={donation ? donation.id : "no-donation"}
        >
          {contentRender(actionType, donation, onOpenChange, isOpen)}
        </Dialog>
      )}
    </>
  );
}

const contentRender = (
  type: "view" | "edit" | "delete" | "",
  donation: DonationListTable,
  onOpenChange: (open: boolean) => void,
  parentModalOpen: boolean
) => {
  switch (type) {
    case "":
      return null;
    case "view":
      return (
        <ViewDialog
          donation={donation}
          onOpenChange={onOpenChange}
          parentModalOpen={parentModalOpen}
        />
      );
    case "edit":
      return (
        <EditDialog
          donation={donation}
          onOpenChange={onOpenChange}
          parentModalOpen={parentModalOpen}
        />
      );
    default:
      return null;
  }
};

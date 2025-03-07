import PageSize from "@/components/page-size.tsx";
import TextFilter from "@/components/text-filter.tsx";
import { DataTable } from "@/components/datatable.tsx";
import { overviewTableColumns } from "@/types/table-overview.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Plus, Save, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  description: z.string(),
  target_amount: z.number().min(1, {
    message: "Target amount must be greater than 0",
  }),
});

export default function DonationProgram() {
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
  });

  function onSubmit(values: z.infer<typeof addFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <>
      <Card>
        <div className="p-6 inline-flex flex-row justify-between items-center w-full">
          <h1 className="text-xl font-semibold">Donation Program List</h1>
          <Dialog>
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
                  onSubmit={addForm.handleSubmit(onSubmit)}
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
                          <Input
                            placeholder="Write recipient name"
                            {...field}
                          />
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
                              onChange(
                                event.target.files && event.target.files[0]
                              )
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
                              onChange(
                                event.target.files && event.target.files[0]
                              )
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
                    <Button type="submit" variant="secondary">
                      <Save /> Save
                    </Button>
                    <Button type="submit">
                      <Send /> Save & Activate
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="px-6 pb-6">
          <div className="py-4 inline-flex flex-row items-center gap-5">
            <PageSize />
            <TextFilter placeholder="Find Program Name" />
          </div>
          {/*todo: check data*/}
          {/*<>
                  <div className="flex items-center justify-center">
                    No data to be displayed
                  </div>
                </>*/}

          <DataTable
            columns={overviewTableColumns}
            data={Array.from({ length: 20 }).map(() => ({
              invoice_number: "INV-001",
              date: new Date(),
              donor_name: "John Doe",
              program_name: "Education Support Program",
              amount: 5000000000,
              method: "Credit Card",
              status: "PAID",
            }))}
            meta={{
              total: 50,
              per_page: 15,
              current_page: 1,
              last_page: 4,
              first_page_url: "http://laravel.app?page=1",
              last_page_url: "http://laravel.app?page=4",
              next_page_url: "http://laravel.app?page=2",
              prev_page_url: undefined,
              path: "http://laravel.app",
              from: 1,
              to: 15,
            }}
          />
        </div>
      </Card>
    </>
  );
}

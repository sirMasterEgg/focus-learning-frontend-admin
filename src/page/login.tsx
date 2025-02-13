import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import logo from "@/assets/icon.svg";
import { useLoginMutation } from "@/api/core/auth/login.api.ts";
import { useDispatch } from "react-redux";
import { setUser } from "@/stores/slices/auth.slices.ts";
import { useNavigate } from "react-router-dom";
import { RouteList } from "@/lib/route-list.ts";
import { Toaster } from "@/components/ui/toaster.tsx";
import { useToast } from "@/hooks/use-toast.ts";
import { AxiosError } from "axios";

const formSchema = z.object({
  email: z
    .string()
    .email({
      message: "Email isn't valid",
    })
    .min(1, {
      message: "Email is required",
    }),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useLoginMutation();

  function onSubmit(values: z.infer<typeof formSchema>) {
    loginMutation.mutate(
      [
        {
          email: values.email,
          password: values.password,
        },
      ],
      {
        onSuccess: (result) => {
          dispatch(
            setUser({
              user: result.data.user,
              token: result.data.token,
            })
          );

          navigate(RouteList.HOME, {
            replace: true,
          });
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            if (error.response?.status === 401) {
              toast({
                variant: "destructive",
                description: "Login failed",
              });
            }
          }
        },
      }
    );
  }

  return (
    <>
      <main className="bg-[#09090B] w-screen h-screen flex items-center justify-center">
        <div className="flex flex-col justify-center items-center gap-5">
          <img className="w-36" src={logo} alt={"Logo"} />
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle className="text-center">Admin Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <FormItem>
                    <FormLabel className="">Email</FormLabel>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field, fieldState }) => (
                        <>
                          <FormControl>
                            <Input
                              placeholder="Enter email address"
                              {...field}
                              className={
                                fieldState.error
                                  ? "border-red-500 focus-visible:ring-red-500"
                                  : ""
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </>
                      )}
                    />
                  </FormItem>
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field, fieldState }) => (
                        <>
                          <FormControl>
                            <Input
                              placeholder="Enter password"
                              type="password"
                              className={
                                fieldState.error
                                  ? "border-red-500 focus-visible:ring-red-500"
                                  : ""
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </>
                      )}
                    />
                  </FormItem>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      !form.watch("email") ||
                      !form.watch("password") ||
                      form.formState.isSubmitting ||
                      loginMutation.isPending
                    }
                  >
                    {loginMutation.isPending ? "Loading..." : "Sign In"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <Toaster />
      </main>
    </>
  );
}

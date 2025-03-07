import logo from "@/assets/icon.svg";
import { Outlet, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button.tsx";
import { ChevronDown } from "lucide-react";
import { RootState } from "@/stores/store.ts";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "@/api/core/auth/logout.api.ts";
import { toast } from "@/hooks/use-toast.ts";
import { RouteList } from "@/lib/route-list.ts";
import { AxiosError } from "axios";
import { unsetUser } from "@/stores/slices/auth.slices.ts";

export default function AuthenticatedLayout() {
  const auth = useSelector((state: RootState) => state.auth);

  const logoutMutation = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    logoutMutation.mutate(
      [
        {
          token: auth.token as string,
        },
      ],
      {
        onSuccess: () => {
          dispatch(unsetUser());
          navigate(RouteList.LOGIN, {
            replace: true,
          });
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            if (error?.response?.status && error.response.status >= 400) {
              toast({
                variant: "destructive",
                description: error.response.data.message,
              });
            }
          }
        },
      }
    );
  };

  return (
    <>
      <nav className="flex flex-row justify-between items-center py-2 px-8">
        <div className="w-24">
          <img src={logo} alt="Logo" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="w-40 justify-between font-normal"
              variant="outline"
            >
              {auth.user?.name}
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <DropdownMenuItem>Account Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLogout()}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
      <main className="px-8 py-6">
        <Outlet />
      </main>
    </>
  );
}

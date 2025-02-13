import logo from "@/assets/icon.svg";
import { Outlet } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button.tsx";
import { ChevronDown } from "lucide-react";
import { RootState } from "@/stores/store.ts";
import { useSelector } from "react-redux";

export default function AuthenticatedLayout() {
  const auth = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    //
    console.log(auth);
    console.log("Logout");
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
              Admin
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

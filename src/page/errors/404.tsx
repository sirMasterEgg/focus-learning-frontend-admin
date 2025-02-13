import { RouteList } from "@/lib/route-list.ts";
import { buttonVariants } from "@/components/ui/button.tsx";

export default function ErrorNotFound() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-5">
      <div className="w-full flex flex-col items-center gap-2">
        <h1 className="text-5xl font-bold">404 Page Not Found</h1>
        <p className="text-lg">
          Sorry, we couldn't find the page you're looking for.
        </p>
      </div>
      <a
        href={RouteList.HOME}
        className={buttonVariants({ variant: "default" }) + " space-y-5"}
      >
        Return to website
      </a>
    </div>
  );
}

import { RootState } from "@/stores/store.ts";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { RouteList } from "@/lib/route-list.ts";

export default function GuestMiddleware() {
  const auth = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!auth.user) {
    return <Outlet />;
  }

  return <Navigate to={RouteList.HOME} replace state={{ from: location }} />;
}

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { RouteList } from "@/lib/route-list.ts";
import LoginPage from "@/page/login.tsx";
import MainPage from "@/page/main.tsx";
import ErrorNotFound from "@/page/errors/404.tsx";
import GuestMiddleware from "@/middlewares/GuestMiddleware.tsx";
import AuthenticatedMiddleware from "@/middlewares/AuthenticatedMiddleware.tsx";
import AuthenticatedLayout from "@/page/layout/authenticated.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route errorElement={<ErrorNotFound />}>
        <Route element={<GuestMiddleware />}>
          <Route path={RouteList.LOGIN} element={<LoginPage />} />
        </Route>
        <Route element={<AuthenticatedMiddleware />}>
          <Route element={<AuthenticatedLayout />}>
            <Route path={RouteList.HOME} element={<MainPage />} />
            <Route path={RouteList.DONATION_PROGRAM} element={<MainPage />} />
            <Route path={RouteList.USER_MONITORING} element={<MainPage />} />
          </Route>
        </Route>
      </Route>
    </>
  ),
  {
    future: {
      v7_fetcherPersist: true,
      v7_relativeSplatPath: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

function App() {
  return (
    <RouterProvider
      future={{
        v7_startTransition: true,
      }}
      router={router}
    />
  );
}

export default App;

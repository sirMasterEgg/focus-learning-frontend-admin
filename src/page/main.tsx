import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { DatePickerWithRange } from "@/components/date-range-picker.tsx";
import { RouteList } from "@/lib/route-list.ts";
import { Link, useLocation } from "react-router-dom";
import Home from "@/page/home.tsx";
import DonationProgram from "@/page/donation-program.tsx";
import { Toaster } from "@/components/ui/toaster.tsx";
import UsersMonitoring from "@/page/users-monitoring.tsx";

export default function MainPage() {
  const route = useLocation();

  return (
    <>
      <div className="space-y-4">
        <div className="flex lg:items-center lg:justify-between space-y-2 lg:flex-row flex-col">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <DatePickerWithRange />
          </div>
        </div>
        <Tabs className="space-y-4" defaultValue={route.pathname}>
          <TabsList>
            <TabsTrigger value={RouteList.HOME} asChild>
              <Link to={RouteList.HOME}>Overview</Link>
            </TabsTrigger>
            <TabsTrigger value={RouteList.DONATION_PROGRAM}>
              <Link to={RouteList.DONATION_PROGRAM}>Donation Program</Link>
            </TabsTrigger>
            <TabsTrigger value={RouteList.USER_MONITORING}>
              <Link to={RouteList.USER_MONITORING}>User Monitoring</Link>
            </TabsTrigger>
          </TabsList>
          <TabsContent className="space-y-4" value={RouteList.HOME}>
            <Home />
          </TabsContent>
          <TabsContent className="space-y-4" value={RouteList.DONATION_PROGRAM}>
            <DonationProgram />
          </TabsContent>
          <TabsContent className="space-y-4" value={RouteList.USER_MONITORING}>
            <UsersMonitoring />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </>
  );
}

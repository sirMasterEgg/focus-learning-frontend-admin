import DashboardCard from "@/components/card.tsx";
import { DollarSign, LinkIcon, Users } from "lucide-react";
import { Card } from "@/components/ui/card.tsx";
import { DataTable } from "@/components/datatable.tsx";
import { overviewTableColumns } from "@/types/table-overview.tsx";
import PageSize from "@/components/page-size.tsx";
import TextFilter from "@/components/text-filter.tsx";

export default function Home() {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          label="Total Recieved Donation"
          icon={DollarSign}
          amount="No data"
          description=""
        />
        <DashboardCard
          label="Total User"
          icon={Users}
          amount="No data"
          description=""
        />
        <DashboardCard
          label="Active Program"
          icon={LinkIcon}
          amount="No data"
          description=""
        />
      </div>
      <Card>
        <h1 className="p-6 text-xl font-semibold">Donation History</h1>
        <div className="px-6 pb-6">
          <div className="py-4 inline-flex flex-row items-center gap-5">
            <PageSize />
            <TextFilter placeholder="Find Invoice Number" />
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

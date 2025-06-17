import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { useGetDetailDonationHistoryQuery } from "@/api/core/donation-histories/get-detail-donation-history.ts";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store.ts";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { LoaderCircle } from "lucide-react";

type DonationHistoryModalProps = {
  donationId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const DonationHistoryModal = ({
  donationId,
  isOpen,
  onOpenChange,
}: DonationHistoryModalProps) => {
  const auth = useSelector((state: RootState) => state.auth);
  const { data, isLoading } = useGetDetailDonationHistoryQuery([
    auth.token || "",
    {
      id: donationId,
    },
  ]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View Donation Transaction</DialogTitle>
            <DialogDescription>
              Preview of the details of the donation from users.
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <>
              <div className="w-full min-h-20 flex items-center justify-center">
                <LoaderCircle className="animate-spin" />
              </div>
            </>
          ) : !data?.data ? (
            <>
              <div className="w-full min-h-20 flex items-center justify-center">
                No data to be displayed
              </div>
            </>
          ) : (
            data?.data && (
              <>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="invoice">Invoice Number</Label>
                  <Input
                    disabled
                    className="disabled:cursor-default"
                    id="invoice"
                    value={data.data.human_readable_id}
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    disabled
                    className="disabled:cursor-default"
                    id="date"
                    value={dateFormat(data.data.created_at)}
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="donor">Donator Name</Label>
                  <Input
                    disabled
                    className="disabled:cursor-default"
                    id="donor"
                    value={data.data.name}
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    disabled
                    className="disabled:cursor-default"
                    id="email"
                    value={data.data.email}
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="program">Program Name</Label>
                  <Input
                    disabled
                    className="disabled:cursor-default"
                    id="program"
                    value={data.data.program_name}
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    disabled
                    className="disabled:cursor-default"
                    id="amount"
                    value={currencyFormat(data.data.donation_amount)}
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="target">Target Amount</Label>
                  <Input
                    disabled
                    className="disabled:cursor-default"
                    id="target"
                    value={currencyFormat(data.data.target_amount)}
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="method">Method</Label>
                  <Input
                    disabled
                    id="method"
                    value={data.data.payment.method}
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label>Status</Label>
                  <BadgeStatus status={data.data.payment.status} />
                </div>
              </>
            )
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DonationHistoryModal;

const BadgeStatus = ({ status }: { status: string }) => {
  switch (status.toUpperCase()) {
    case "SUCCESS":
      return (
        <>
          <Badge className="border-transparent bg-success text-success-foreground shadow hover:bg-success/80 w-fit">
            {status.toUpperCase()}
          </Badge>
        </>
      );
    case "PENDING":
      return (
        <>
          <Badge className="w-fit" variant="destructive">
            {status.toUpperCase()}
          </Badge>
        </>
      );
    case "FAILED":
      return (
        <>
          <Badge className="w-fit">{status.toUpperCase()}</Badge>
        </>
      );
  }

  return (
    <>
      <Badge className="w-fit" variant="secondary">
        UNKNOWN
      </Badge>
    </>
  );
};
const dateFormat = (stringDate: string) => {
  const date = new Date(stringDate).toLocaleDateString("en-UK", {
    dateStyle: "medium",
  });
  const time = new Date(stringDate).toLocaleTimeString("en-UK", {
    timeStyle: "short",
  });
  return `${date} ${time}`;
};
const currencyFormat = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
};

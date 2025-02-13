import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card.tsx";

export type CardProps = {
  label: string;
  icon: LucideIcon;
  amount: string;
  description: string;
};

export default function DashboardCard(props: CardProps) {
  return (
    <Card>
      <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="tracking-tight text-sm font-medium">{props.label}</div>
        <props.icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <CardContent>
        <div className="text-2xl font-bold">{props.amount}</div>
        <p className="text-xs text-muted-foreground">{props.description}</p>
      </CardContent>
    </Card>
  );
}

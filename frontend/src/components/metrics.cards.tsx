import { Card } from "@/components/ui/card";

interface MetricCardProps {
  icon: string;
  label: string;
  value: string;
}

export function MetricCard({ icon, label, value }: MetricCardProps) {
  return (
    <Card className="p-4 flex items-start space-x-4">
      <div className="text-zinc-900">{icon}</div>
      <div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-2xl font-semibold">{value}</div>
      </div>
    </Card>
  );
}

export function MetricsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard icon="$" label="Total Spend" value="$955.83" />
      <MetricCard icon="□" label="Transactions" value="26" />
      <MetricCard icon="┃" label="Avg. Transaction" value="$36.76" />
      <MetricCard icon="□" label="Merchants" value="12" />
    </div>
  );
}

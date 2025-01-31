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

interface Transaction {
  original: string;
  normalized: {
    merchant: string;
    category: string;
    sub_category: string;
    confidence: number;
    flags: string[];
  };
}

interface Pattern {
  type: string;
  merchant: string;
  amount: number | string;
  frequency?: string;
  confidence?: number;
  next_expected?: string;
  notes?: string;
}

interface MetricsCardsProps {
  data: {
    normalized_transactions: Transaction[];
    detected_patterns: Pattern[];
  } | null;
}

export function MetricsCards({ data }: MetricsCardsProps) {
  const calculateMetrics = () => {
    if (!data) {
      return {
        totalSpend: 0,
        transactionCount: 0,
        avgTransaction: 0,
        merchantCount: 0,
      };
    }

    const { normalized_transactions, detected_patterns } = data;

    // Calculate total spend
    const totalSpend = detected_patterns.reduce((sum, pattern) => {
      const amount =
        typeof pattern.amount === "number"
          ? pattern.amount
          : parseFloat(pattern.amount.replace(/[^0-9.-]+/g, ""));
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    // Count transactions
    const transactionCount = normalized_transactions.length;

    // Calculate average transaction
    const avgTransaction = totalSpend / transactionCount;

    // Count unique merchants
    const uniqueMerchants = new Set(
      normalized_transactions.map((t) => t.normalized.merchant)
    );
    const merchantCount = uniqueMerchants.size;

    return {
      totalSpend,
      transactionCount,
      avgTransaction,
      merchantCount,
    };
  };

  const { totalSpend, transactionCount, avgTransaction, merchantCount } =
    calculateMetrics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        icon="$"
        label="Total Spend"
        value={`$${totalSpend.toFixed(2)}`}
      />
      <MetricCard
        icon="□"
        label="Transactions"
        value={transactionCount.toString()}
      />
      <MetricCard
        icon="┃"
        label="Avg. Transaction"
        value={`$${avgTransaction.toFixed(2)}`}
      />
      <MetricCard icon="□" label="Merchants" value={merchantCount.toString()} />
    </div>
  );
}

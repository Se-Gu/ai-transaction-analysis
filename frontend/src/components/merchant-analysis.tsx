import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface NormalizedTransaction {
  original: string;
  normalized: {
    merchant: string;
    category: string;
    sub_category: string;
    confidence: number;
    flags: string[];
  };
}

interface MerchantAnalysisProps {
  data: NormalizedTransaction[] | undefined;
}

export function MerchantAnalysis({ data }: MerchantAnalysisProps) {
  if (!data) {
    return <div>No data available. Please upload a CSV file.</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-1">Normalized Merchants</h2>
        <p className="text-sm text-muted-foreground">
          AI-powered merchant name normalization and categorization
        </p>
      </div>

      <div className="space-y-4">
        {data.map((transaction) => (
          <Card key={transaction.original} className="p-4">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Original</div>
                  <div className="font-mono">{transaction.original}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    Normalized
                  </div>
                  <div className="font-semibold">
                    {transaction.normalized.merchant}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-zinc-100">
                  {transaction.normalized.category}
                </Badge>
                <Badge variant="secondary" className="bg-zinc-100">
                  {transaction.normalized.sub_category}
                </Badge>
                {transaction.normalized.flags.map((flag) => (
                  <Badge key={flag} variant="secondary" className="bg-zinc-100">
                    {flag}
                  </Badge>
                ))}
                <Badge variant="secondary" className="bg-zinc-100">
                  Confidence:{" "}
                  {(transaction.normalized.confidence * 100).toFixed(0)}%
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

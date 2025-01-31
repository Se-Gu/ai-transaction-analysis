import { Card } from "@/components/ui/card";

interface Pattern {
  type: string;
  merchant: string;
  amount: number | string;
  frequency?: string;
  confidence?: number;
  next_expected?: string;
  notes?: string;
}

interface PatternDetectionProps {
  data: Pattern[] | undefined;
}

export function PatternDetection({ data }: PatternDetectionProps) {
  if (!data) {
    return <div>No data available. Please upload a CSV file.</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-1">Detected Patterns</h2>
        <p className="text-sm text-muted-foreground">
          Subscription and recurring payment detection
        </p>
      </div>

      <div className="space-y-4">
        {data.map((pattern, index) => (
          <Card key={index} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{pattern.merchant}</h3>
                <p className="text-sm text-muted-foreground">
                  {pattern.type}{" "}
                  {pattern.frequency ? `• ${pattern.frequency}` : ""}
                </p>
                {pattern.notes && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {pattern.notes}
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  $
                  {typeof pattern.amount === "number"
                    ? pattern.amount.toFixed(2)
                    : pattern.amount}
                </div>
                {pattern.next_expected && (
                  <div className="text-sm text-muted-foreground">
                    Next: {pattern.next_expected}
                  </div>
                )}
                {pattern.confidence && (
                  <div className="text-sm text-muted-foreground">
                    Confidence: {(pattern.confidence * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

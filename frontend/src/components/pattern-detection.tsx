import { Card } from "@/components/ui/card";

interface Pattern {
  name: string;
  type: string;
  description: string;
  amount: string;
  next?: string;
}

const patterns: Pattern[] = [
  {
    name: "Netflix",
    type: "subscription • monthly",
    description: "Consistent monthly payment on the 1st/15th",
    amount: "$19.99",
    next: "Next: 2/1/2024",
  },
  {
    name: "Spotify",
    type: "subscription • monthly",
    description: "Regular monthly subscription",
    amount: "$9.99",
    next: "Next: 2/2/2024",
  },
  {
    name: "Uber",
    type: "recurring • weekly",
    description: "Regular rides averaging $31.50 per trip",
    amount: "$~31.50",
  },
  {
    name: "Starbucks",
    type: "recurring • 2-3 times per week",
    description: "Regular purchases at the same location",
    amount: "$5.75",
  },
  {
    name: "Apple",
    type: "subscription • monthly",
    description: "Monthly subscription service",
    amount: "$2.99",
    next: "Next: 2/15/2024",
  },
];

export function PatternDetection() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-1">Detected Patterns</h2>
        <p className="text-sm text-muted-foreground">
          Subscription and recurring payment detection
        </p>
      </div>

      <div className="space-y-4">
        {patterns.map((pattern) => (
          <Card key={pattern.name} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{pattern.name}</h3>
                <p className="text-sm text-muted-foreground">{pattern.type}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {pattern.description}
                </p>
              </div>
              <div className="text-right">
                <div className="font-semibold">{pattern.amount}</div>
                {pattern.next && (
                  <div className="text-sm text-muted-foreground">
                    {pattern.next}
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

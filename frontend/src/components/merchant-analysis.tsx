import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface Merchant {
  original: string;
  normalized: string;
  tags: string[];
}

const merchants: Merchant[] = [
  {
    original: "NFLX DIGITAL NTFLX US",
    normalized: "Netflix",
    tags: [
      "Entertainment",
      "Streaming Services",
      "subscription",
      "digital_service",
      "monthly",
    ],
  },
  {
    original: "AMZN MKTP US+Z1234ABC",
    normalized: "Amazon",
    tags: ["Shopping", "Online Retail", "online_purchase", "marketplace"],
  },
  {
    original: "UBER *TRIP HELP.UBER.CO",
    normalized: "Uber",
    tags: ["Transportation", "Ride Sharing", "transportation", "service"],
  },
  {
    original: "SPOTIFY P5D4E9B1D1",
    normalized: "Spotify",
    tags: [
      "Entertainment",
      "Streaming Services",
      "subscription",
      "digital_service",
      "monthly",
    ],
  },
  {
    original: "STARBUCKS STORE #8752",
    normalized: "Starbucks",
    tags: ["Food & Drink", "Coffee Shop", "frequent", "food_and_beverage"],
  },
  {
    original: "NFLX DIGITAL NTFLX US",
    normalized: "Netflix",
    tags: [
      "Entertainment",
      "Streaming Services",
      "subscription",
      "digital_service",
      "monthly",
    ],
  },
  {
    original: "AMZN MKTP US+Z1234ABC",
    normalized: "Amazon",
    tags: ["Shopping", "Online Retail", "online_purchase", "marketplace"],
  },
  {
    original: "UBER *TRIP HELP.UBER.CO",
    normalized: "Uber",
    tags: ["Transportation", "Ride Sharing", "transportation", "service"],
  },
  {
    original: "SPOTIFY P5D4E9B1D1",
    normalized: "Spotify",
    tags: [
      "Entertainment",
      "Streaming Services",
      "subscription",
      "digital_service",
      "monthly",
    ],
  },
  {
    original: "STARBUCKS STORE #8752",
    normalized: "Starbucks",
    tags: ["Food & Drink", "Coffee Shop", "frequent", "food_and_beverage"],
  },
  {
    original: "NFLX DIGITAL NTFLX US",
    normalized: "Netflix",
    tags: [
      "Entertainment",
      "Streaming Services",
      "subscription",
      "digital_service",
      "monthly",
    ],
  },
  {
    original: "AMZN MKTP US+Z1234ABC",
    normalized: "Amazon",
    tags: ["Shopping", "Online Retail", "online_purchase", "marketplace"],
  },
  {
    original: "UBER *TRIP HELP.UBER.CO",
    normalized: "Uber",
    tags: ["Transportation", "Ride Sharing", "transportation", "service"],
  },
  {
    original: "SPOTIFY P5D4E9B1D1",
    normalized: "Spotify",
    tags: [
      "Entertainment",
      "Streaming Services",
      "subscription",
      "digital_service",
      "monthly",
    ],
  },
  {
    original: "STARBUCKS STORE #8752",
    normalized: "Starbucks",
    tags: ["Food & Drink", "Coffee Shop", "frequent", "food_and_beverage"],
  },
];

export function MerchantAnalysis() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-1">Normalized Merchants</h2>
        <p className="text-sm text-muted-foreground">
          AI-powered merchant name normalization and categorization
        </p>
      </div>

      <div className="space-y-4">
        {merchants.map((merchant) => (
          <Card key={merchant.original} className="p-4">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Original</div>
                  <div className="font-mono">{merchant.original}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    Normalized
                  </div>
                  <div className="font-semibold">{merchant.normalized}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {merchant.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-zinc-100">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

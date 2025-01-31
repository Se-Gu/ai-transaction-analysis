import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import OpenAI from 'openai';
import { TransactionDto } from '../analyze/dtos/transaction.dto';
import {
  calculateTokens,
  preprocessTransactions,
  groupTransactionsByMerchant,
} from 'src/utils';

@Injectable()
export class AiService {
  private readonly openai: OpenAI;
  private readonly merchantListString: string;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.merchantListString =
      "Amazon, Walmart, Target, Starbucks, Uber, Netflix, Spotify, DoorDash, Apple, Shell, Chevron, Walgreens, CVS, Best Buy, Costco, eBay, Etsy, Instacart, McDonald's, Chick-fil-A, Subway, Burger King, Taco Bell, Wendy's, Panera Bread, Dunkin', Chipotle, Domino's, Papa John's, Lyft, Venmo, PayPal, Airbnb, Expedia, Southwest Airlines, Delta Airlines, American Airlines, JetBlue, Marriott, Hilton, Hyatt, Home Depot, Lowe's, Ikea, Bed Bath & Beyond, Kohl's, Nordstrom, Macy's, Gap, Old Navy, Banana Republic, Sephora, Ulta Beauty, Victoria's Secret, Bath & Body Works, Lululemon, Nike, Adidas, Dick's Sporting Goods, Academy Sports, REI, 7-Eleven, Circle K, ExxonMobil, BP, Sam's Club, BJ's Wholesale, Kroger, Safeway, Publix, Albertsons, Trader Joe's, Whole Foods Market, Aldi, Sprouts Farmers Market, H-E-B, Harris Teeter, Giant, Stop & Shop, ShopRite, Wegmans, Food Lion, Meijer, CVS Health, Rite Aid, AT&T, Verizon, T-Mobile, Comcast, Xfinity, Spectrum, Disney+, Hulu, HBO Max, Peacock, Paramount+, Crunchyroll, Amazon Prime, SiriusXM, Audible.";
  }

  async normalizeMerchant(transaction: TransactionDto): Promise<any> {
    const description = transaction.description.trim();
    console.log('Processing transaction:', description);

    // Check Redis cache for existing normalized transaction
    const cachedResult = await this.cacheManager.get(description);
    console.log('Retrieved from cache:', cachedResult); // Debug log

    // If cached, return the cached result
    if (cachedResult) {
      return JSON.parse(cachedResult as string);
    }

    // Construct LLM Prompt
    const prompt = `You are a financial transaction categorization model. Normalize the following transaction:

    Known merchants: ${this.merchantListString}.

    Transaction:
    ${JSON.stringify(description)}

    Respond with a JSON object that includes:
    - "original": The original string.
    - "normalized": Object containing "merchant", "category", "sub_category", "confidence", and "flags".

    Example Input:
    "NETFLIX"

    Example Output:
    {
      "original": "NETFLIX",
      "normalized": {
        "merchant": "Netflix",
        "category": "Entertainment",
        "sub_category": "Streaming Services",
        "confidence": 0.98,
        "flags": ["subscription", "digital_service"]
      }
    }`;

    console.log('Prompt token count:', calculateTokens(prompt));

    try {
      // Send request to OpenAI
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      });

      let result;
      try {
        result = JSON.parse(response.choices[0]?.message?.content || '{}');
      } catch (error) {
        console.error('Error parsing OpenAI response:', error);
        result = { error: 'Failed to parse response' };
      }

      // Store new result in Redis
      const ONE_MONTH_IN_MS = 86400 * 1000 * 30; // 30 days in milliseconds
      await this.cacheManager.set(
        description,
        JSON.stringify(result),
        ONE_MONTH_IN_MS,
      );
      console.log('Stored in cache:', description, result); // Debug log

      return result;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);

      // Cache fallback for failed API calls
      const ONE_MONTH_IN_MS = 86400 * 1000 * 30; // 30 days in milliseconds
      await this.cacheManager.set(
        description,
        JSON.stringify({ error: 'Failed to process' }),
        ONE_MONTH_IN_MS,
      );

      return { error: 'Failed to process the request' };
    }
  }

  async normalizeMerchants(transactions: TransactionDto[]): Promise<any[]> {
    // Preprocess transactions to extract unique descriptions
    const descriptionList = preprocessTransactions(transactions);
    console.log('Preprocessed description list:', descriptionList);

    // Check Redis cache for existing normalized transactions
    const cachedResults = await Promise.all(
      descriptionList.map(async (desc) => {
        const cached = await this.cacheManager.get(desc);
        return cached ? JSON.parse(cached as string) : null;
      }),
    );

    // Separate cached & uncached transactions
    const resultsFromCache = cachedResults.filter((res) => res !== null);
    const missingDescriptions = descriptionList.filter(
      (_, index) => cachedResults[index] === null,
    );

    console.log('Missing descriptions (not in cache):', missingDescriptions);

    // If everything is cached, return the cached results
    if (missingDescriptions.length === 0) {
      return resultsFromCache;
    }

    // Construct LLM Prompt
    const prompt = `You are a financial transaction categorization model. Normalize the following transactions:

    Known merchants: ${this.merchantListString}.

    Transactions:
    ${JSON.stringify(missingDescriptions)}

    Respond with a JSON array where each element includes:
    - "original": The original string.
    - "normalized": Object containing "merchant", "category", "sub_category", "confidence", and "flags".

    Example Input:
    ["NETFLIX", "AMZN MKTP US*Z1234ABC"]

    Example Output:
    [
      {
        "original": "NETFLIX",
        "normalized": {
          "merchant": "Netflix",
          "category": "Entertainment",
          "sub_category": "Streaming Services",
          "confidence": 0.98,
          "flags": ["subscription", "digital_service"]
        }
      }
    ]`;

    console.log('Prompt token count:', calculateTokens(prompt));

    try {
      // Send request to OpenAI
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      });

      const batchResults = JSON.parse(
        response.choices[0]?.message?.content || '[]',
      );

      // Store new results in Redis
      for (const result of batchResults) {
        await this.cacheManager.set(
          result.original,
          JSON.stringify(result),
          86400 * 1000 * 30, // 30 days in milliseconds
        );
      }

      // Return merged cached + newly fetched results
      return [...resultsFromCache, ...batchResults];
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return [{ error: 'Failed to process the request' }];
    }
  }

  async analyzePatterns(transactions: TransactionDto[]): Promise<any> {
    console.log('Received transactions for pattern analysis:', transactions);

    // Step 1: Normalize merchants (fills Redis cache)
    await this.normalizeMerchants(transactions);

    // Step 2: Fetch normalized merchant names from Redis
    const transactionsWithNormalizedMerchants = await Promise.all(
      transactions.map(async (transaction) => {
        const cachedMerchant = await this.cacheManager.get(
          transaction.description,
        );
        const normalizedMerchant = cachedMerchant
          ? JSON.parse(cachedMerchant as string).normalized.merchant
          : 'Unknown';

        return { ...transaction, normalizedMerchant };
      }),
    );

    console.log(
      'Transactions mapped to normalized merchants:',
      transactionsWithNormalizedMerchants,
    );

    // Step 3: Group transactions by normalized merchant
    const groupedTransactions = groupTransactionsByMerchant(
      transactionsWithNormalizedMerchants,
    );

    console.log('Grouped Transactions:', groupedTransactions);

    // Step 4: Construct LLM Prompt
    const llmPrompt = `
    You are an AI financial analyst. Analyze the following transactions grouped by merchant and identify recurring patterns.

    Grouped Transactions:
    ${JSON.stringify(groupedTransactions)}

    For each merchant in the transaction data, respond with the following structure:

    {
      "patterns": [
        {
          "type": "subscription" | "recurring" | "one-time",
          "merchant": "Merchant Name",
          "amount": Average Amount (or exact amount if consistent),
          "frequency": "monthly" | "weekly" | "bi-weekly" | "irregular",
          "confidence": Confidence Score (0 to 1),
          "next_expected": "YYYY-MM-DD" (if applicable),
          "notes": "Additional context or observations"
        }
      ]
    }

    Definitions for 'type':
    1. 'subscription':
      - Transactions that occur regularly (e.g., monthly, weekly) with the same or nearly the same amount.
      - Example: Netflix, Spotify, gym memberships.
      - Key characteristics:
        - Fixed or nearly fixed amount.
        - Predictable frequency (e.g., monthly on the same date).

    2. 'recurring':
      - Transactions that occur multiple times but are not regular in timing or amount.
      - Example: Uber rides, grocery store visits, coffee shops.
      - Key characteristics:
        - Irregular timing.
        - Variable amounts.
        - No fixed schedule.

    3. 'one-time':
      - Transactions that occur only once for a specific merchant.
      - Example: A single purchase from an online store, a one-time donation, or a unique event ticket.
      - Key characteristics:
        - Only one transaction for the merchant in the dataset.

    Example Input:
    {
      "Netflix": [
        {"description": "NETFLIX", "amount": -19.99, "date": "2024-01-01", "normalizedMerchant": "Netflix"},
        {"description": "NETFLIX", "amount": -19.99, "date": "2024-02-01", "normalizedMerchant": "Netflix"}
      ],
      "Uber": [
        {"description": "UBER TRIP", "amount": -35.50, "date": "2024-01-02", "normalizedMerchant": "Uber"},
        {"description": "UBER TRIP", "amount": -28.75, "date": "2024-01-07", "normalizedMerchant": "Uber"}
      ]
    }

    Example Output:
    {
      "patterns": [
        {
          "type": "subscription",
          "merchant": "Netflix",
          "amount": 19.99,
          "frequency": "monthly",
          "confidence": 0.98,
          "next_expected": "2024-03-01"
        },
        {
          "type": "recurring",
          "merchant": "Uber",
          "amount": "~32.00",
          "frequency": "weekly",
          "confidence": 0.85,
          "notes": "Regular weekend rides"
        }
      ]
    }`;

    console.log('Prompt token count:', calculateTokens(llmPrompt));

    try {
      // Step 5: Call OpenAI
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: llmPrompt }],
      });

      // Step 6: Parse OpenAI Response
      const detectedPatterns = JSON.parse(
        response.choices[0]?.message?.content || '{}',
      );

      console.log('Stored patterns in cache:', detectedPatterns);
      return detectedPatterns;
    } catch (error) {
      console.error('Error analyzing patterns:', error);
      return { error: 'Failed to analyze transaction patterns' };
    }
  }
}

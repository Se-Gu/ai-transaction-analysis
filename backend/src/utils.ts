import { encoding_for_model, TiktokenModel } from 'tiktoken';
import { TransactionDto } from './modules/analyze/dtos/transaction.dto';

// Function to calculate the token count
export function calculateTokens(
  input: string,
  model: string = 'gpt-3.5-turbo',
): number {
  const tokenizer = encoding_for_model(model as TiktokenModel); // Initialize tokenizer for the model
  const tokens = tokenizer.encode(input); // Encode the input
  const tokenCount = tokens.length; // Get token count
  tokenizer.free(); // Free resources
  return tokenCount;
}

/**
 * Preprocess transactions by extracting unique descriptions.
 * @param transactions Array of transaction objects (each containing description, amount, and date).
 * @returns A Set of unique transaction descriptions.
 */
export function preprocessTransactions(
  transactions: TransactionDto[],
): string[] {
  const uniqueDescriptions = new Set<string>();

  transactions.forEach((transaction) => {
    uniqueDescriptions.add(transaction.description.trim());
  });

  return Array.from(uniqueDescriptions);
}

/**
 * Groups transactions by their normalized merchant name.
 * @param transactions Array of transactions with normalized merchant names.
 * @returns A dictionary where keys are merchant names and values are arrays of transactions.
 */
export function groupTransactionsByMerchant(
  transactions: any[],
): Record<string, any[]> {
  return transactions.reduce(
    (acc, transaction) => {
      const merchant = transaction.normalizedMerchant;
      if (!acc[merchant]) {
        acc[merchant] = [];
      }
      acc[merchant].push(transaction);
      return acc;
    },
    {} as Record<string, any[]>,
  );
}

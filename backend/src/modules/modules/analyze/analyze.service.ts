import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyzeService {
  normalizeMerchant(transaction: { description: string }) {
    // Simulate AI normalization logic
    const description = transaction.description.toLowerCase();

    if (description.includes('amzn')) {
      return {
        merchant: 'Amazon',
        category: 'Shopping',
        sub_category: 'Online Retail',
        confidence: 0.95,
        is_subscription: false,
        flags: ['online_purchase', 'marketplace'],
      };
    } else {
      return {
        merchant: 'Unknown',
        category: 'Other',
        sub_category: 'Unknown',
        confidence: 0.5,
        is_subscription: false,
        flags: [],
      };
    }
  }
}

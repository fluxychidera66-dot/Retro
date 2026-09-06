export type DataType = 'TEXT' | 'NUMBER' | 'CURRENCY' | 'DATE' | 'EMAIL' | 'BOOLEAN';

export interface ExtractedField {
  id: string;
  name: string;
  type: DataType;
  columnHeader: string;
  exampleValue: string;
}

export interface Automation {
  id: string;
  name: string;
  plainEnglishPrompt: string;
  triggerRule: string;
  destinationSheet: string;
  fields: ExtractedField[];
  status: 'active' | 'paused';
  processedCount: number;
  needsReviewCount: number;
  lastRunAt: string;
  createdAt: string;
}

export interface ProcessingItem {
  id: string;
  automationId: string;
  automationName: string;
  sender: string;
  subject: string;
  date: string;
  status: 'success' | 'flagged' | 'failed' | 'rejected';
  confidence: number;
  extractedData: Record<string, string>;
  rawSnippet: string;
}

export interface ReviewItem {
  id: string;
  automationId: string;
  automationName: string;
  sender: string;
  subject: string;
  date: string;
  snippet: string;
  extractedFields: Record<string, string>;
  uncertainField: string;
  confidence: number;
  alternativeOptions: string[];
  simpleQuestion?: string;
  simpleExplanation?: string;
  optionsWithDetails?: {
    value: string;
    label: string;
    description: string;
    isRecommended?: boolean;
  }[];
}

export interface UserAccount {
  name: string;
  email: string;
  avatarUrl: string;
  isConnected: boolean;
  connectedAt?: string;
  connectedSheet: string;
  plan: 'Free Trial' | 'Starter' | 'Pro' | 'Business';
  usedEmails: number;
  planLimit: number;
}

// lib/types.ts
export interface Paste {
  _id: string;
  content: string;
  createdAt: Date;
  expiresAt: Date | null;
  maxViews: number | null;
  views: number;
}

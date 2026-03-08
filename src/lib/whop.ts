import Whop from '@whop/sdk';

let whopClient: Whop | null = null;

export function getWhopClient(): Whop {
  if (!whopClient) {
    whopClient = new Whop({
      apiKey: process.env.WHOP_API_KEY!,
    });
  }
  return whopClient;
}

export const WHOP_APP_ID = process.env.NEXT_PUBLIC_WHOP_APP_ID!;

export interface SocialAccount {
  id: string;
  networkName: string;
  email: string;
  username: string;
  password?: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  socialAccounts?: SocialAccount[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  lowestPrice: number;
  currentPrice: number;
  lastPrice?: number | null;
  imageUrl: string;
  title: string;
  accessLink: string;
  campaignId: string;
}

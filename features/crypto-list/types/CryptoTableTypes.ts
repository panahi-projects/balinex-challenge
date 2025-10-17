export interface Crypto {
  id: string;
  name: string;
  symbol: string;
  price: string;
  transactionValue?: string;
  percentChange?: string;
  image?: string;
  enable?: boolean;
}

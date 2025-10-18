import { CoinDetails } from "@/features";

const CryptoDetailsPage = ({ params }: { params: { symbol: string } }) => {
  const { symbol } = params;
  return (
    <div className="container mx-auto my-4">
      <CoinDetails symbol={symbol} />
    </div>
  );
};
export default CryptoDetailsPage;

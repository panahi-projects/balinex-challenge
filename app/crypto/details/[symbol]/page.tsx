import { CoinDetails } from "@/features";
import { Card } from "@/shared";
import BackButton from "@/shared/components/BackButton";

const CryptoDetailsPage = ({ params }: { params: { symbol: string } }) => {
  const { symbol } = params;
  return (
    <div className="container mx-auto my-4">
      <Card className="relative">
        <div className="absolute top-0 left-0">
          <BackButton />
        </div>
        <CoinDetails symbol={symbol} />
      </Card>
    </div>
  );
};
export default CryptoDetailsPage;

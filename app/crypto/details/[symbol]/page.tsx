import { CoinDetails } from "@/features";
import { Card } from "@/shared";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const CryptoDetailsPage = ({ params }: { params: { symbol: string } }) => {
  const { symbol } = params;
  return (
    <div className="container mx-auto my-4">
      <Card className="relative">
        <div className="absolute top-0 left-0 p-4">
          <Link href="/" className="flex items-center gap-2 text-secondary-600">
            <span>بازگشت</span>
            <ArrowLeftIcon className="w-4 h-4" />
          </Link>
        </div>
        <CoinDetails symbol={symbol} />
      </Card>
    </div>
  );
};
export default CryptoDetailsPage;

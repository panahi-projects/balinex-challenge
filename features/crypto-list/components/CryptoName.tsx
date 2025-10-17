import Image from "next/image";
import { Crypto } from "../types";
import { CryptoCurrency } from "../constants";

const CryptoName = ({ name, symbol, image }: Omit<Crypto, "id">) => {
  const fallbackLogo = "/images/coin-placeholder.webp";
  const logoUrl = image || fallbackLogo;

  return (
    <div className="flex items-center gap-4">
      <Image src={logoUrl} alt={name} width={40} height={40} />
      <div className="flex flex-col gap-1">
        <div>
          <span className="text-[12px] md:text-[14px] lg:text-[16px]">
            {name}
          </span>{" "}
          /{" "}
          <span className="text-primary-800 latin-font text-bold text-[12px] md:text-[14px] lg:text-[16px]">
            {symbol}
          </span>
        </div>
        <div className="text-sm text-secondary-text">
          {CryptoCurrency[symbol.toUpperCase() as keyof typeof CryptoCurrency]}
        </div>
      </div>
    </div>
  );
};

export default CryptoName;

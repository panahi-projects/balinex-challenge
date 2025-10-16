import Image from "next/image";
import { Crypto } from "../types";

const CryptoName = ({ name, symbol, image }: Omit<Crypto, "id">) => {
  return (
    <div className="flex items-center gap-2">
      <Image src={image || ""} alt={name} width={50} height={50} />
      <span>
        {name} / {symbol}
      </span>
    </div>
  );
};

export default CryptoName;

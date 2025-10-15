import LogoImage from "@/public/images/logo.svg";
import Image from "next/image";

const Logo = () => {
  return (
    <Image
      src={LogoImage}
      alt="BalinexLogo"
      width={120}
      height={25}
      aria-label="BalinexLogo"
      aria-labelledby="BalinexLogo"
    />
  );
};

export default Logo;

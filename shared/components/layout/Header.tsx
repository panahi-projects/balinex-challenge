import { Logo } from "@/shared";
import Navbar from "./Navbar";
import Authentication from "./Authentication";

const Header = () => {
  return (
    <header className="bg-background-50 text-primary-900">
      <div className="container-fluid">
        <div className="flex flex-row items-center justify-between gap-4 py-6">
          <div className=" flex flex-row items-center justify-start gap-16">
            <Logo />
            <Navbar />
          </div>

          {/* Auth action buttons */}
          <div>
            <Authentication />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

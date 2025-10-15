"use client";
import { useState } from "react";
import { Logo } from "@/shared";
import Navbar from "./Navbar";
import Authentication from "./Authentication";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-background-50 text-primary-900">
      <div className="container-fluid">
        <div className="flex flex-row items-center justify-between gap-4 py-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-row items-center justify-start gap-16 flex-1">
            <Navbar />
          </div>

          {/* Desktop Auth buttons */}
          <div className="hidden lg:block">
            <Authentication />
          </div>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span
              className={`block w-6 h-0.5 bg-primary-900 transition-all duration-300 ${
                isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-primary-900 transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-primary-900 transition-all duration-300 ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 border-t border-gray-200">
            {/* Mobile Navigation */}
            <div className="mb-6">
              <Navbar />
            </div>

            {/* Mobile Auth buttons */}
            <div className="flex flex-col gap-3">
              <Authentication />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

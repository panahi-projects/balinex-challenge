import Link from "next/link";

const Navbar = () => {
  const links = [
    {
      id: "buy-crypto",
      label: "خرید رمز ارزها",
      name: "buy-crypto",
      href: "/buy-crypto",
      children: [],
    },
    {
      id: "crypto-price",
      label: "قیمت رمز ارزها",
      name: "crypto-price",
      href: "/crypto-price",
      children: [],
    },
    {
      id: "market",
      label: "بازار معاملاتی",
      name: "market",
      href: "/market",
      children: [],
    },
    {
      id: "blog",
      label: "مجله بالینکس",
      name: "blog",
      href: "/blog",
      children: [],
    },
    {
      id: "about",
      label: "درباره ما",
      name: "about",
      href: "/about",
      children: [],
    },
  ];
  return (
    <nav>
      <ul className="flex flex-col lg:flex-row items-start lg:items-center justify-start lg:justify-between gap-4 lg:gap-12">
        {links.map((link) => (
          <li
            key={link.id}
            className="text-primary-800 text-sm hover:text-primary-600 transition-colors"
          >
            <Link
              href={link.href}
              className="block py-2 lg:py-0 hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;

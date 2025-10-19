import Link from "next/link";

const Navbar = () => {
  const links = [
    {
      id: "crypto-list",
      label: "لیست رمز ارزها",
      name: "crypto-list",
      href: "/",
      children: [],
    },
    {
      id: "new-crypto",
      label: "افزودن رمز ارز جدید",
      name: "new-crypto",
      href: "/crypto/new",
      children: [],
    },
    {
      id: "search-highlight",
      label: "جستجوی متنی",
      name: "search-highlight",
      href: "/search-highlight",
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

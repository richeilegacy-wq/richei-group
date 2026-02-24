import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Home", href: "/" },
      { label: "Features", href: "/#features" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "#contact" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
    ],
  },
];

export default function PublicFooter() {
  return (
    <footer className="w-full bg-white">
      <div className="container mx-auto px-6 md:px-16 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr_1fr] gap-10 md:gap-8">
          <div className="space-y-4">
            <Image
              src="/images/logo.png"
              alt="RicHei Group"
              width={90}
              height={50}
              className="object-contain"
            />
            <p className="text-sm text-gray-600 leading-relaxed max-w-[200px]">
              RicHei Assets empowers African real estate investment.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="font-bold text-base text-primary mb-4">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href as Route}
                      className="text-sm text-gray-600 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <Image
          src="/images/footer-cut-logo.png"
          alt="RicHei Group"
          width={1440}
          height={300}
          className="w-full h-auto object-cover"
          priority={false}
        />
      </div>
    </footer>
  );
}

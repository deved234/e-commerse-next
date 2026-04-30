import Link from "next/link";
import { ShoppingCart, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-slate-900" />
              </div>
              <span className="text-white font-bold text-xl">
                Shop<span className="text-amber-400">Zone</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your trusted online marketplace. Quality products, fast delivery,
              great prices.
            </p>

            <div className="flex items-center gap-3 mt-4">

              <a
                href="#"
                className="w-8 h-8 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
            Shop
          </h4>
          <ul className="space-y-2">
            {[
              { href: "/products", label: "All Products" },
              { href: "/products?featured=true", label: "Featured" },
              {
                href: "/products?sort=price&order=asc",
                label: "Best Prices",
              },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-slate-400 hover:text-amber-400 text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
            Account
          </h4>
          <ul className="space-y-2">
            {[
              { href: "/profile", label: "My Profile" },
              { href: "/orders", label: "My Orders" },
              { href: "/wishlist", label: "Wishlist" },
              { href: "/cart", label: "Cart" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-slate-400 hover:text-amber-400 text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
            Contact
          </h4>
          <ul className="space-y-3">
            {[
              { icon: Mail, text: "support@shopzone.com" },
              { icon: Phone, text: "+20 100 000 0000" },
              { icon: MapPin, text: "Cairo, Egypt" },
            ].map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-2 text-slate-400 text-sm"
              >
                <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} ShopZone. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          {["Privacy Policy", "Terms of Service"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </div>
    </footer >
  );
}

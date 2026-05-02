"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useTranslation } from "@/lib/TranslationContext";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
  Package,
  LogOut,
  LayoutDashboard,
  Store,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const { totalItems, toggleCart } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { t, locale } = useTranslation();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/products", label: t("nav.products") },
  ];

  const userMenuItems = [
    { href: "/profile", label: t("nav.profile"), icon: User },
    { href: "/orders", label: t("nav.orders"), icon: Package },
    { href: "/wishlist", label: t("nav.wishlist"), icon: Heart },
    ...(session?.user?.role === "admin"
      ? [{ href: "/admin", label: t("nav.adminPanel"), icon: LayoutDashboard }]
      : []),
    ...(session?.user?.role === "seller"
      ? [{ href: "/seller", label: t("nav.sellerDashboard"), icon: Store }]
      : []),
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-slate-900/95 backdrop-blur-md shadow-lg shadow-black/20"
            : "bg-slate-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center group-hover:bg-amber-300 transition-colors">
                <ShoppingCart className="w-4 h-4 text-slate-900" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                Shop<span className="text-amber-400">Zone</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-amber-400"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
              >
                <Heart className="w-5 h-5" />
                {mounted && wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
              >
                <ShoppingCart className="w-5 h-5" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-slate-900 text-xs rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-2 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
                  >
                    <div className="w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center text-slate-900 font-bold text-xs">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-12 w-52 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-700">
                          <p className="text-white font-medium text-sm truncate">
                            {session.user.name}
                          </p>
                          <p className="text-slate-400 text-xs truncate">
                            {session.user.email}
                          </p>
                        </div>
                        <div className="py-1">
                          {userMenuItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-sm"
                            >
                              <item.icon className="w-4 h-4" />
                              {item.label}
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-slate-700 py-1">
                          <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="flex items-center gap-3 px-4 py-2.5 text-rose-400 hover:text-rose-300 hover:bg-slate-700 transition-colors text-sm w-full"
                          >
                            <LogOut className="w-4 h-4" />
                            {t("nav.signOut")}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold text-sm rounded-lg transition-colors"
                >
                  {t("nav.signIn")}
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
              >
                {mobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-amber-400/10 text-amber-400"
                      : "text-slate-300 hover:text-white hover:bg-slate-700"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!session && (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 bg-amber-400 text-slate-900 font-semibold text-sm rounded-lg text-center mt-2"
                >
                  {t("nav.signIn")}
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-2xl bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b border-slate-700">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                autoFocus
                type="text"
                placeholder={t("common.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    window.location.href = `/products?search=${searchQuery}`;
                    setSearchOpen(false);
                  }
                  if (e.key === "Escape") setSearchOpen(false);
                }}
                className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-lg"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 text-slate-500 text-sm">
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-300 text-xs">
                Enter
              </kbd>{" "}
              to search
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, Plus, Search, User } from "lucide-react";
import { useApp } from "./AppProvider";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "__sell__", label: "Sell", icon: Plus },
  { href: "/chat", label: "Messages", icon: MessageCircle },
  { href: "/profile", label: "Profile", icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { setSellModalOpen, unreadCount } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <ul className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isSell = item.href === "__sell__";
          const active =
            !isSell &&
            (item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href));

          if (isSell) {
            return (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => setSellModalOpen(true)}
                  className="-mt-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700"
                  aria-label="Sell item"
                >
                  <Plus className="h-6 w-6" />
                </button>
              </li>
            );
          }

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`relative flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] ${
                  active ? "font-semibold text-emerald-600" : "text-slate-500"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
                {item.href === "/chat" && unreadCount > 0 && (
                  <span className="absolute right-2 top-0 h-2 w-2 rounded-full bg-emerald-500" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

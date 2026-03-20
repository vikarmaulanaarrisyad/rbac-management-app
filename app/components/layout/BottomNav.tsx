"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const BottomNav = () => {
  const pathname = usePathname();

  const menus = [
    { name: "Home", href: "/", icon: "🏠" },
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Profile", href: "/profile", icon: "👤" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 md:hidden">
      <div className="bg-slate-900/90 backdrop-blur border-t border-slate-700 flex justify-around py-2">
        {menus.map((menu) => (
          <Link
            key={menu.name}
            href={menu.href}
            className={`flex flex-col items-center text-xs ${
              isActive(menu.href) ? "text-blue-500" : "text-slate-400"
            }`}
          >
            <span className="text-xl">{menu.icon}</span>
            <span>{menu.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/coordinator/dashboard/profile", label: "Profile" },
    { href: "/coordinator/dashboard/btechDb/defaultFormat", label: "B.Tech Default DB" },
    { href: "/coordinator/dashboard/btechDb/customFormat", label: "B.Tech Custom DB" },
    { href: "/coordinator/dashboard/mtechDb/defaultFormat", label: "M.Tech Default DB" },
    { href: "/coordinator/dashboard/mtechDb/customFormat", label: "M.Tech Custom DB" },
    { href: "/coordinator/dashboard/mtechDb2027/defaultFormat", label: "M.Tech 2027 Default DB" },
    { href: "/coordinator/dashboard/mtechDb2027/customFormat", label: "M.Tech 2027 Custom DB" },
  ];

  return (
    <aside className="w-72 h-screen bg-slate-900 text-white flex flex-col justify-between shadow-lg">
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold text-slate-300 mb-4 tracking-wide uppercase">
          Coordinator Panel
        </h2>
        <nav className="flex flex-col gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm hover:bg-slate-700 transition-all duration-200",
                pathname === link.href && "bg-slate-700 font-medium text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/admin/dashboard/profile", label: "Profile" },
    { href: "/admin/dashboard/uploadbtech", label: "Upload B.Tech" },
    { href: "/admin/dashboard/uploadmtech", label: "Upload M.Tech" },
    { href: "/admin/dashboard/uploadmtech2027", label: "Upload M.Tech 2027" },
    { href: "/admin/dashboard/studentProfile/btech", label: "Btech Student Profile" },
    { href: "/admin/dashboard/studentProfile/mtech", label: "Mtech Student Profile" },
    { href: "/admin/dashboard/studentProfile/mtech2027", label: "Mtech 2027 Student Profile" },
    { href: "/admin/dashboard/manage/admin", label: "Manage Admin" },
    { href: "/admin/dashboard/manage/coordinator", label: "Manage Coordinators" },
    { href: "/admin/dashboard/offers/add", label: "Add Offer" },
    { href: "/admin/dashboard/offers2027/add", label: "Add Offer 2027" },
    { href: "/admin/dashboard/offers/manage", label: "Manage Offers" },
    { href: "/admin/dashboard/offers2027/manage", label: "Manage Offers 2027" },
  ];

  return (
    <aside className="w-72 h-screen bg-slate-900 text-white flex flex-col justify-between shadow-lg">
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold text-slate-300 mb-4 tracking-wide uppercase">
          Admin Panel
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
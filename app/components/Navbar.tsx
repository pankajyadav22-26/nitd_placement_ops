"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "@headlessui/react";
import {
  ArrowRightOnRectangleIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const [centerHeading, setCenterHeading] = useState("");

  useEffect(() => {
    if (pathname.includes("/admin/dashboard")) {
      setCenterHeading("Admin Dashboard");
    } else if (pathname.includes("/coordinator/dashboard")) {
      setCenterHeading("Coordinator Dashboard");
    } else {
      setCenterHeading("");
    }
  }, [pathname]);

  let dashboardHref = "/";
  if (session?.user?.role === "admin") {
    dashboardHref = "/admin/dashboard";
  } else if (session?.user?.role === "coordinator") {
    dashboardHref = "/coordinator/dashboard";
  }

  return (
    <nav className="sticky top-0 z-50 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm py-3 px-6">
      <div className="mx-auto flex items-center justify-between flex-wrap gap-4">
        <Link href="/" className="flex items-center space-x-3 group">
          <Image
            src="/logo.png"
            alt="NIT Delhi Logo"
            width={48}
            height={48}
            className="block dark:hidden transition-transform duration-200 group-hover:scale-105"
          />
          <Image
            src="/logoDarkMode.png"
            alt="NIT Delhi Logo Dark"
            width={48}
            height={48}
            className="hidden dark:block transition-transform duration-200 group-hover:scale-105"
          />
          <div className="leading-tight">
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Training & Placement Cell
            </p>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-amber-500 transition-colors">
              NIT Delhi
            </h2>
          </div>
        </Link>

        <div className="text-center flex-1">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-200">
            {centerHeading}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="text-sm sm:text-base hover:text-indigo-600 dark:hover:text-indigo-400 text-gray-700 dark:text-gray-200 transition-colors"
          >
            Home
          </Link>

          {session ? (
            <>
            <Link
            href="/statistics"
            className="text-sm sm:text-base hover:text-indigo-600 dark:hover:text-indigo-400 text-gray-700 dark:text-gray-200 transition-colors"
          >
            Statistics
          </Link>
          <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                {session.user.name || "Account"}
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href={dashboardHref}
                        className={`flex items-center px-4 py-2 text-sm gap-2 ${
                          active
                            ? "bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white"
                            : "text-gray-700 dark:text-gray-200"
                        }`}
                      >
                        <Squares2X2Icon className="h-5 w-5" />
                        Dashboard
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => signOut()}
                        className={`flex items-center w-full px-4 py-2 text-sm gap-2 ${
                          active
                            ? "bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white"
                            : "text-gray-700 dark:text-gray-200"
                        }`}
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu>
            </>
            
          ) : (
            <>
              <Link
                href="/admin/signin"
                className="hover:text-green-600 dark:hover:text-green-400 transition-colors text-sm text-black dark:text-white"
              >
                Admin Login
              </Link>
              <Link
                href="/coordinator/signin"
                className="hover:text-green-600 dark:hover:text-green-400 transition-colors text-sm text-black dark:text-white"
              >
                Coordinator Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

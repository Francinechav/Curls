"use client";

import Header2 from "./components/Header2";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutGrid,
  Package,
  CalendarCheck,
  ShoppingCart,
  Repeat,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type SubMenuItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

type NavItem = {
  label: string;
  href?: string;
  icon: React.ReactNode;
  badge?: string;
  submenu?: SubMenuItem[];
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: <LayoutGrid className="w-5 h-5" /> },
    { label: "Products", href: "/dashboard/wigs", icon: <Package className="w-5 h-5" /> },
    {
      label: "Bookings",
      icon: <CalendarCheck className="w-5 h-5" />,
      submenu: [
        { label: "Orders", href: "/dashboard/orders", icon: <ShoppingCart className="w-4 h-4" /> },
        { label: "Rentals", href: "/dashboard/rentals", icon: <Repeat className="w-4 h-4" /> },
        { label: "Special Orders", href: "/dashboard/special-orders", icon: <Package className="w-4 h-4" /> },
      ],
    },
    { label: "Transactions", href: "/dashboard/transactions", icon: <CreditCard className="w-5 h-5" />, badge: "NEW" },
    { label: "Reports", href: "/dashboard/reports", icon: <BarChart3 className="w-5 h-5" /> },
  ];

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleLogout = () => {
    // Example: clear localStorage/session and redirect
    localStorage.removeItem("token"); // or however you store auth
    router.push("/login");
  };

  return (
    <div className={`flex min-h-screen ${mobileOpen ? "overflow-hidden" : ""}`}>

      {/* MOBILE HAMBURGER */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* SIDEBAR */}
      <aside
  className={`bg-white border-r border-gray-200 flex flex-col p-6 w-64 
  md:static fixed top-0 left-0 h-full z-40 transition-transform duration-300
  ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
>


        {/* LOGO */}
        <div className="flex justify-center items-center mb-8">
          <Image src="/logo.png" alt="logo" width={40} height={42} />
        </div>

        {/* MENU */}
        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className={`flex items-center justify-between w-full text-[15px] py-2 text-gray-500 hover:text-black transition-colors duration-200 ${
                      item.href && pathname === item.href ? "text-black font-semibold" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    <span className="ml-auto">
                      {openSubmenus[item.label] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </span>
                  </button>
                  {item.submenu && openSubmenus[item.label] && (
                    <div className="ml-6 flex flex-col gap-2 mt-1">
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={`flex items-center gap-2 text-gray-500 text-sm pl-2 hover:text-black transition-colors duration-200 ${
                            pathname === sub.href ? "text-black font-semibold" : ""
                          }`}
                        >
                          <span>{sub.icon}</span>
                          <span>{sub.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                item.href && (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 text-[15px] py-2 text-gray-500 hover:text-black transition-colors duration-200 ${
                      pathname === item.href ? "text-black font-semibold" : ""
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full ml-auto">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              )}
            </div>
          ))}
        </nav>

        {/* SETTINGS & LOGOUT */}
        <div className="mt-auto">
          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-3 text-[15px] mb-4 text-gray-500 hover:text-black transition-colors duration-200 ${
              pathname === "/dashboard/settings" ? "text-black font-semibold" : ""
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-500 text-[15px] hover:text-red-600 transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {mobileOpen && (
  <div
    className="fixed inset-0 bg-black/30 z-30 md:hidden"
    onClick={() => setMobileOpen(false)}
  />
)}


      {/* MAIN CONTENT */}
      {/* MAIN CONTENT */}
<div className="flex-1 flex flex-col transition-all duration-300">
  <Header2 />
  <main className="p-4 md:p-6">{children}</main>
</div>

    </div>
  );
}

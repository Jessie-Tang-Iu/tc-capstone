"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function EmployerSidebar() {
  const pathname = usePathname();
  const menu = [
    { name: "Message", href: "/adminDashboard/message" },
    { name: "View All User", href: "/adminDashboard/viewAllUser" },
    { name: "View Request", href: "/adminDashboard/viewRequest" },
    { name: "View Report", href: "/adminDashboard/viewReport" },
  ];

  return (
    <aside className="ml-0 w-52 shrink-0 rounded-lg bg-white p-1 shadow">
      {menu.map((m) => {
        const active = pathname?.startsWith(m.href);
        return (
          <Link key={m.name} href={m.href} className="block">
            <div
              className={`rounded-md px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-[#E2B596] text-black"
                  : "text-black hover:bg-[#F0E0D5]"
              }`}
            >
              {m.name} <span className="ml-1">{">"}</span>
            </div>
          </Link>
        );
      })}
    </aside>
  );
}

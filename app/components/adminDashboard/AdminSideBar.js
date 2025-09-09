"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdvisorSideBar() {
  const pathname = usePathname();

  const Item = ({ href, label }) => {
    const active = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        href={href}
        className={`w-full text-left rounded-md px-4 py-3 text-sm font-medium transition block
          text-black hover:bg-[#F0E0D5] ${active ? "bg-[#E2B596]" : ""}`}
      >
        {label} <span className="ml-1">{">"}</span>
      </Link>
    );
  };

  return (
    <div className="ml-0 w-60 rounded-lg bg-white p-1 flex flex-col shadow">
      <Item href="/adminDashboard" label="Message" />
      <Item href="/adminDashboard/User" label="Users" />
      <Item href="/adminDashboard/Request" label="Requests" />
      <Item href="/adminDashboard/Report" label="Reports" />
    </div>
  );
}

// app/event/layout.js
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

export default function EventLayout({ children }) {
  return children;
}

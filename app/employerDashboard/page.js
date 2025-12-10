import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default function EmployerDashboardRoot() {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  redirect("/employerDashboard/message");
}

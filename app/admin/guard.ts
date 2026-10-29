import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";

/** Call at the top of every admin page (not the login page). Sends visitors without a valid session to the login form. */
export async function requireAdminPage() {
  if (!(await isAdmin())) redirect("/admin/login/");
}

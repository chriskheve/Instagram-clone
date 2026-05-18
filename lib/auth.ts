import { redirect } from "next/navigation";
import { getUser } from "@/server/actions/user.actions";

export async function checkAuth() {
  const user = await getUser();
  if (user) {
    redirect("/feed");
  }
}

import { cookies } from "next/headers";

export async function POST() {
  (await cookies()).set("token", "", { expires: new Date(0), path: "/" });

  return Response.json({ message: "Logged out" });
}
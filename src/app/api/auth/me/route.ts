import { getUserFromToken } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getUserFromToken();

    if (!user) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    return Response.json({ user });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

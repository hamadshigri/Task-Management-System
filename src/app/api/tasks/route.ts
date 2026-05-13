export const runtime = "nodejs";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import Task from "@/models/Task";

export async function GET() {
  try {
    await connectDB();

    const user = await getUserFromToken();

    console.log("USER:", user);

    if (!user) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const tasks = await Task.find({
      userId: user.userId,
    }).sort({
      createdAt: -1,
    });

    return Response.json(tasks);
  } catch (error) {
    console.log("GET TASK ERROR:", error);

    return Response.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const user = await getUserFromToken();

    if (!user) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const task = await Task.create({
      ...body,
      userId: user.userId,
    });

    return Response.json(task);
  } catch (error) {
    console.log("CREATE TASK ERROR:", error);

    return Response.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import Task from "@/models/Task";

export async function GET() {
  await connectDB();

  const user = await getUserFromToken();

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
}

export async function POST(req: Request) {
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
}
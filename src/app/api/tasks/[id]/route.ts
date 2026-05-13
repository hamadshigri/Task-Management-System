export const runtime = "nodejs";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import Task from "@/models/Task";

type Params = {
  params: {
    id: string;
  };
};

// UPDATE TASK
export async function PUT(
  req: Request,
  { params }: Params
) {
  try {
    await connectDB();

    const user = await getUserFromToken();

    if (!user) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;    

    const body = await req.json();

    const updatedTask =
      await Task.findOneAndUpdate(
        {
          _id: id,
          userId: user.userId,
        },
        body,
        { new: true }
      );

    return Response.json(updatedTask);
  } catch (error) {
    console.log(error);

    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// DELETE TASK
export async function DELETE(
  req: Request,
  { params }: Params
) {
  try {
    await connectDB();

    const user = await getUserFromToken();

    if (!user) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    await Task.findOneAndDelete({
      _id: id,
      userId: user.userId,
    });

    return Response.json({
      message: "Task deleted",
    });
  } catch (error) {
    console.log(error);

    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
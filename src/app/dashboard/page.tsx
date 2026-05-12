"use client";

import { useEffect, useState } from "react";

type Task = {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
};

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [filter, setFilter] = useState("all");

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });

  // Fetch tasks
  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");

    const data = await res.json();

    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create task
  const createTask = async (e: any) => {
    e.preventDefault();

    await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(form),
    });

    setForm({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
    });

    fetchTasks();
  };

  // Delete task
  const deleteTask = async (id: string) => {
    await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });

    fetchTasks();
  };

  // Toggle complete
  const toggleComplete = async (
    id: string,
    status: string
  ) => {
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        status:
          status === "completed"
            ? "pending"
            : "completed",
      }),
    });

    fetchTasks();
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;

    return task.status === filter;
  });

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#020617] text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold">
            Task Dashboard
          </h1>

          <p className="text-gray-400 mt-2">
            Organize your workflow efficiently
          </p>
        </div>

        <button
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500"
          onClick={async () => {
            await fetch("/api/auth/logout", {
              method: "POST",
            });

            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>

      {/* Create Task */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white/5 border border-white/10 backdrop-blur p-6 rounded-3xl">
          <h2 className="text-xl font-semibold mb-5">
            Create Task
          </h2>

          <form
            onSubmit={createTask}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Task title"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
              className="w-full p-3 rounded-xl bg-black/30 border border-white/10"
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              className="w-full p-3 rounded-xl bg-black/30 border border-white/10"
            />

            <select
              value={form.priority}
              onChange={(e) =>
                setForm({
                  ...form,
                  priority: e.target.value,
                })
              }
              className="w-full p-3 rounded-xl bg-black/30 border border-white/10"
            >
              <option value="low">Low</option>
              <option value="medium">
                Medium
              </option>
              <option value="high">High</option>
            </select>

            <input
              type="date"
              value={form.dueDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  dueDate: e.target.value,
                })
              }
              className="w-full p-3 rounded-xl bg-black/30 border border-white/10"
            />

            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500">
              Create Task
            </button>
          </form>
        </div>

        {/* Tasks */}
        <div className="md:col-span-2">
          {/* Filters */}
          <div className="flex gap-3 mb-6">
            {["all", "pending", "completed"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`px-4 py-2 rounded-xl capitalize ${
                    filter === item
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                      : "bg-white/10"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>

          {/* Task Cards */}
          <div className="grid gap-5">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {task.title}
                    </h3>

                    <p className="text-gray-400 mt-2">
                      {task.description}
                    </p>

                    <div className="flex gap-3 mt-4">
                      <span className="px-3 py-1 rounded-full text-sm bg-purple-500/20">
                        {task.priority}
                      </span>

                      <span className="px-3 py-1 rounded-full text-sm bg-indigo-500/20">
                        {task.status}
                      </span>
                    </div>

                    {task.dueDate && (
                      <p className="text-sm text-gray-500 mt-3">
                        Due:{" "}
                        {new Date(
                          task.dueDate
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        toggleComplete(
                          task._id,
                          task.status
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-green-500/20"
                    >
                      ✓
                    </button>

                    <button
                      onClick={() =>
                        deleteTask(task._id)
                      }
                      className="px-4 py-2 rounded-xl bg-white/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredTasks.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                No tasks found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
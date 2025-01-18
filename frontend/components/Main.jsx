import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import Pagination from "./Pagination";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

const getTasks = async (page = 1) => {
    const response = await fetch(
        `http://localhost:4000/api/tasks?page=${page}`
    );
    return response.json();
};

export default function App() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    // Query for fetching tasks
    const { data, isLoading, error } = useQuery({
        queryKey: ["tasks", currentPage],
        queryFn: () => getTasks(currentPage),
    });

    // Add task mutation
    const addTaskMutation = useMutation({
        mutationFn: async (newTask) => {
            const response = await fetch("http://localhost:4000/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTask),
            });
            if (!response.ok) {
                throw new Error("Failed to create task");
            }
            return response.json();
        },
        onMutate: async (newTask) => {
            await queryClient.cancelQueries(["tasks", currentPage]);
            const previousTasks = queryClient.getQueryData([
                "tasks",
                currentPage,
            ]);

            // Optimistically add the new task to the cache
            queryClient.setQueryData(["tasks", currentPage], (old) => ({
                ...old,
                data: {
                    ...old.data,
                    tasks: [
                        {
                            ...newTask,
                            _id: Date.now().toString(), // Temporary ID
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        },
                        ...old.data.tasks,
                    ],
                },
            }));

            return { previousTasks };
        },
        onError: (err, newTask, context) => {
            queryClient.setQueryData(
                ["tasks", currentPage],
                context.previousTasks
            );
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to create task",
            });
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Task created successfully",
            });
            setIsFormOpen(false);
        },
        onSettled: () => {
            queryClient.invalidateQueries(["tasks", currentPage]);
        },
    });

    // Edit task mutation
    const editTaskMutation = useMutation({
        mutationFn: async ({ taskId, updatedTask }) => {
            const response = await fetch(
                `http://localhost:4000/api/tasks/${taskId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedTask),
                }
            );
            if (!response.ok) {
                throw new Error("Failed to update task");
            }
            return response.json();
        },
        onMutate: async ({ taskId, updatedTask }) => {
            await queryClient.cancelQueries(["tasks", currentPage]);
            const previousTasks = queryClient.getQueryData([
                "tasks",
                currentPage,
            ]);

            queryClient.setQueryData(["tasks", currentPage], (old) => ({
                ...old,
                data: {
                    ...old.data,
                    tasks: old.data.tasks.map((task) =>
                        task._id === taskId ? { ...task, ...updatedTask } : task
                    ),
                },
            }));

            return { previousTasks };
        },
        onError: (err, variables, context) => {
            queryClient.setQueryData(
                ["tasks", currentPage],
                context.previousTasks
            );
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update task",
            });
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Task updated successfully",
            });
            setIsFormOpen(false);
            setSelectedTask(null);
        },
    });

    // Delete task mutation
    const deleteTaskMutation = useMutation({
        mutationFn: async (taskId) => {
            const response = await fetch(
                `http://localhost:4000/api/tasks/${taskId}`,
                {
                    method: "DELETE",
                }
            );
            if (!response.ok) {
                throw new Error("Failed to delete task");
            }
            return response.json();
        },
        onMutate: async (taskId) => {
            await queryClient.cancelQueries(["tasks", currentPage]);
            const previousTasks = queryClient.getQueryData([
                "tasks",
                currentPage,
            ]);

            // Optimistically remove the task from the cache
            queryClient.setQueryData(["tasks", currentPage], (old) => ({
                ...old,
                data: {
                    ...old.data,
                    tasks: old.data.tasks.filter((task) => task._id !== taskId),
                },
            }));

            return { previousTasks };
        },
        onError: (err, taskId, context) => {
            // Rollback on error
            queryClient.setQueryData(
                ["tasks", currentPage],
                context.previousTasks
            );
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete task",
            });
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Task deleted successfully",
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries(["tasks", currentPage]);
        },
    });

    const handleEditClick = (task) => {
        // Format the date to YYYY-MM-DD for the input field
        const formattedTask = {
            ...task,
            dueDate: task.dueDate
                ? new Date(task.dueDate).toISOString().split("T")[0]
                : "",
        };
        setSelectedTask(formattedTask);
        setIsFormOpen(true);
    };

    const handleSubmit = (taskData) => {
        if (selectedTask) {
            editTaskMutation.mutate({
                taskId: selectedTask._id,
                updatedTask: taskData,
            });
        } else {
            addTaskMutation.mutate(taskData);
        }
    };

    const handleDeleteTask = (taskId) => {
        deleteTaskMutation.mutate(taskId);
    };

    const handleStatusChange = (taskId, newStatus) => {
        editTaskMutation.mutate({
            taskId,
            updatedTask: { status: newStatus },
        });
    };

    if (isLoading)
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="relative w-20 h-20">
                    <div className="absolute top-0 left-0 right-0 bottom-0">
                        <div className="w-20 h-20 border-8 border-gray-200 rounded-full animate-spin border-t-blue-500" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-8 h-8 bg-white rounded-full" />
                    </div>
                </div>
            </div>
        );
    if (error) return <div>Error: {error.message}</div>;

    const tasks = data?.data?.tasks || [];

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Task Manager
                    </h1>
                    <Button onClick={() => setIsFormOpen(true)}>
                        <PlusIcon className="mr-2 h-4 w-4" /> Add Task
                    </Button>
                </header>
                <TaskList
                    tasks={tasks}
                    onEditTask={handleEditClick}
                    onDeleteTask={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                />
                <div className="mt-8">
                    <Pagination
                        currentPage={data?.data?.pagination?.currentPage || 1}
                        totalPages={data?.data?.pagination?.totalPages || 1}
                        onPageChange={setCurrentPage}
                    />
                </div>
                {isFormOpen && (
                    <TaskForm
                        task={selectedTask}
                        onSubmit={handleSubmit}
                        onClose={() => {
                            setIsFormOpen(false);
                            setSelectedTask(null);
                        }}
                    />
                )}
            </div>
        </div>
    );
}

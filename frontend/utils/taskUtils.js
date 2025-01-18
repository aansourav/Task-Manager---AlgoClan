import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Simulate network delay (remove in production)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// API Functions
export const getTasks = async (page = 1) => {
    const response = await fetch(
        `http://localhost:4000/api/tasks?page=${page}`
    );
    return response.json();
};

// Custom hooks for mutations
export const useTaskMutations = (currentPage, onSuccess = {}) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Helper function to show loading toast
    const showLoadingToast = (message) => {
        return toast({
            title: "Loading",
            description: message,
            duration: Infinity, // Will be dismissed programmatically
        });
    };

    // Add task mutation
    const addTaskMutation = useMutation({
        mutationFn: async (newTask) => {
            const loadingToast = showLoadingToast("Creating task...");
            try {
                await delay(1000); // Simulate network delay
                const response = await fetch(
                    "http://localhost:4000/api/tasks",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newTask),
                    }
                );
                if (!response.ok) {
                    throw new Error("Failed to create task");
                }
                return response.json();
            } finally {
                loadingToast.dismiss();
            }
        },
        onMutate: async (newTask) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries(["tasks"]);

            // Snapshot the previous value
            const previousTasks = queryClient.getQueryData([
                "tasks",
                currentPage,
            ]);

            // Optimistically update the cache
            queryClient.setQueryData(["tasks", currentPage], (old) => ({
                ...old,
                data: {
                    ...old.data,
                    tasks: [
                        {
                            ...newTask,
                            _id: Date.now().toString(),
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
            // Revert the optimistic update
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
            onSuccess.addTask?.();

            // Invalidate and refetch all task-related queries
            queryClient.invalidateQueries({
                queryKey: ["tasks"],
                refetchType: "all",
            });
        },
    });

    // Edit task mutation
    const editTaskMutation = useMutation({
        mutationFn: async ({ taskId, updatedTask }) => {
            const loadingToast = showLoadingToast("Updating task...");
            try {
                await delay(800); // Simulate network delay
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
            } finally {
                loadingToast.dismiss();
            }
        },
        onMutate: async ({ taskId, updatedTask }) => {
            await queryClient.cancelQueries(["tasks"]);
            const previousTasks = queryClient.getQueryData([
                "tasks",
                currentPage,
            ]);

            // Optimistically update
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
            onSuccess.editTask?.();

            // Invalidate and refetch all task-related queries
            queryClient.invalidateQueries({
                queryKey: ["tasks"],
                refetchType: "all",
            });
        },
    });

    // Delete task mutation
    const deleteTaskMutation = useMutation({
        mutationFn: async (taskId) => {
            const loadingToast = showLoadingToast("Deleting task...");
            try {
                await delay(1500); // Simulate longer network delay for delete
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
            } finally {
                loadingToast.dismiss();
            }
        },
        onMutate: async (taskId) => {
            await queryClient.cancelQueries(["tasks"]);
            const previousTasks = queryClient.getQueryData([
                "tasks",
                currentPage,
            ]);

            // Optimistically remove the task
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

            // Invalidate and refetch all task-related queries
            queryClient.invalidateQueries({
                queryKey: ["tasks"],
                refetchType: "all",
            });
        },
    });

    return {
        addTaskMutation,
        editTaskMutation,
        deleteTaskMutation,
    };
};

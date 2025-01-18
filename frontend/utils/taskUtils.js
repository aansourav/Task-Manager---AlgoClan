import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
            onSuccess.editTask?.();
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
        },
        onSettled: () => {
            queryClient.invalidateQueries(["tasks", currentPage]);
        },
    });

    return {
        addTaskMutation,
        editTaskMutation,
        deleteTaskMutation,
    };
};

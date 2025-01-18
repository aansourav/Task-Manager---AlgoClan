import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading, error } = useQuery({
        queryKey: ["tasks", currentPage],
        queryFn: () => getTasks(currentPage),
    });

    const [isFormOpen, setIsFormOpen] = useState(false);
    const tasksPerPage = 6;

    // Handle loading and error states
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const tasks = data?.data?.tasks || [];
    const pagination = data?.data?.pagination || {};

    const addTask = async (newTask) => {
        try {
            const response = await fetch("http://localhost:4000/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTask),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to create task");
            }
            queryClient.invalidateQueries(["tasks"]);
            setIsFormOpen(false);
        } catch (error) {
            console.error("Error adding task:", error);
            throw error;
        }
    };

    const editTask = async (taskId, updatedFields) => {
        try {
            const response = await fetch(
                `http://localhost:4000/api/tasks/${taskId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedFields),
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to update task");
            }
            queryClient.invalidateQueries(["tasks"]);
        } catch (error) {
            console.error("Error updating task:", error);
            throw error;
        }
    };

    const deleteTask = async (taskId) => {
        try {
            const response = await fetch(
                `http://localhost:4000/api/tasks/${taskId}`,
                {
                    method: "DELETE",
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to delete task");
            }
            queryClient.invalidateQueries(["tasks"]);
        } catch (error) {
            console.error("Error deleting task:", error);
            throw error;
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

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
                    onEditTask={editTask}
                    onDeleteTask={deleteTask}
                />
                <div className="mt-8">
                    <Pagination
                        currentPage={data?.data?.pagination?.currentPage || 1}
                        totalPages={data?.data?.pagination?.totalPages || 1}
                        onPageChange={handlePageChange}
                    />
                </div>
                {isFormOpen && (
                    <TaskForm
                        onAddTask={addTask}
                        onClose={() => setIsFormOpen(false)}
                    />
                )}
            </div>
        </div>
    );
}

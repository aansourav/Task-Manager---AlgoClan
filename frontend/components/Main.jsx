import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { getTasks, useTaskMutations } from "@/utils/taskUtils";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import Loading from "./Loading";
import Pagination from "./Pagination";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

export default function App() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    // Query for fetching tasks
    const { data, isLoading, error } = useQuery({
        queryKey: ["tasks", currentPage],
        queryFn: () => getTasks(currentPage),
    });

    // Get mutations with success callbacks
    const { addTaskMutation, editTaskMutation, deleteTaskMutation } =
        useTaskMutations(currentPage, {
            addTask: () => setIsFormOpen(false),
            editTask: () => {
                setIsFormOpen(false);
                setSelectedTask(null);
            },
        });

    const handleEditClick = (task) => {
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

    if (isLoading) return <Loading />;
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
            <Toaster />
        </div>
    );
}

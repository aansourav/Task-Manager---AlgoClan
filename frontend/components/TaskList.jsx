import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    CalendarIcon,
    CheckCircleIcon,
    CircleIcon,
    ClockIcon,
    MoreVertical,
    Pencil,
    Trash,
} from "lucide-react";
import React, { useState } from "react";
import TaskForm from "./TaskForm";

const statusIcons = {
    "To Do": <CircleIcon className="h-5 w-5 text-gray-500" />,
    "In Progress": <ClockIcon className="h-5 w-5 text-blue-500" />,
    Done: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
};

const priorityColors = {
    Low: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-red-100 text-red-800",
};

export default function TaskList({ tasks, onEditTask, onDeleteTask }) {
    const [editingTask, setEditingTask] = useState(null);
    const [deletingTask, setDeletingTask] = useState(null);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date
            .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })
            .replace(/ /g, "-");
    };

    const handleEdit = (task) => {
        setEditingTask(task);
    };

    const handleDelete = (task) => {
        setDeletingTask(task);
    };

    const confirmDelete = () => {
        if (deletingTask) {
            onDeleteTask(deletingTask.id);
            setDeletingTask(null);
        }
    };

    const handleStatusChange = (taskId, newStatus) => {
        onEditTask(taskId, { status: newStatus });
        // Close the popover
        document.body.click();
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tasks.map((task) => (
                <Card
                    key={task._id}
                    className="flex flex-col transition-shadow hover:shadow-lg"
                >
                    <CardHeader className="flex-grow">
                        <div className="flex justify-between items-start">
                            <CardTitle className="flex items-center text-lg">
                                <Popover key={task.status}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="p-0 h-auto"
                                        >
                                            {statusIcons[task.status]}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <div className="flex flex-col">
                                            {Object.entries(statusIcons).map(
                                                ([status, icon]) => (
                                                    <Button
                                                        key={status}
                                                        variant="ghost"
                                                        className="flex items-center justify-start px-2 py-1"
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                task.id,
                                                                status
                                                            )
                                                        }
                                                    >
                                                        {React.cloneElement(
                                                            icon,
                                                            {
                                                                className:
                                                                    "mr-2 h-4 w-4",
                                                            }
                                                        )}
                                                        {status}
                                                    </Button>
                                                )
                                            )}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                <span className="ml-2 truncate">
                                    {task.name}
                                </span>
                            </CardTitle>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={() => handleEdit(task)}
                                    >
                                        <Pencil className="mr-2 h-4 w-4" />
                                        <span>Edit</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleDelete(task)}
                                    >
                                        <Trash className="mr-2 h-4 w-4" />
                                        <span>Delete</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <CardDescription className="line-clamp-2">
                            {task.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Badge className={priorityColors[task.priority]}>
                            {task.priority} Priority
                        </Badge>
                    </CardContent>
                    <CardFooter className="text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {task.dueDate && `Due: ${formatDate(task.dueDate)}`}
                    </CardFooter>
                </Card>
            ))}

            {editingTask && (
                <TaskForm
                    task={editingTask}
                    onAddTask={(updatedTask) => {
                        onEditTask(editingTask.id, updatedTask);
                        setEditingTask(null);
                    }}
                    onClose={() => setEditingTask(null)}
                />
            )}

            <AlertDialog
                open={!!deletingTask}
                onOpenChange={() => setDeletingTask(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure you want to delete this task?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the task.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

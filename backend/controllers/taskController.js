import { validationResult } from "express-validator";
import mongoose from "mongoose";
import * as taskService from "../services/taskService.js";

// Get all tasks
export const getTasks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const { tasks, total, totalPages } = await taskService.getAllTasks(
            page,
            limit
        );

        res.status(200).json({
            status: "success",
            data: {
                tasks,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalRecords: total,
                    pageSize: limit,
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to fetch tasks",
            error: error.message,
        });
    }
};

// Add a new task
export const addTask = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: "error",
                message: "Validation failed",
                errors: errors
                    .array()
                    .map((err) => ({ field: err.param, message: err.msg })),
            });
        }

        const { title, description, status, priority, dueDate } = req.body;
        const validStatuses = ["To Do", "In Progress", "Done"];
        const validPriorities = ["Low", "Medium", "High"];

        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid status value",
                error: `Status must be one of: ${validStatuses.join(", ")}`,
            });
        }

        if (priority && !validPriorities.includes(priority)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid priority value",
                error: `Priority must be one of: ${validPriorities.join(", ")}`,
            });
        }

        const taskData = {
            title: title.trim(),
            description: description?.trim(),
            status: status || "To Do",
            priority: priority || "Medium",
            dueDate: dueDate ? new Date(dueDate) : undefined,
        };

        const savedTask = await taskService.createTask(taskData);
        res.status(201).json({
            status: "success",
            message: "Task created successfully",
            data: savedTask,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to add task",
            error: error.message,
        });
    }
};

// Update a task
export const updateTask = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: "error",
                message: "Validation failed",
                errors: errors
                    .array()
                    .map((err) => ({ field: err.param, message: err.msg })),
            });
        }

        const { id } = req.params;
        const { title, description, status, priority, dueDate } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid task ID format",
            });
        }

        const validStatuses = ["To Do", "In Progress", "Done"];
        const validPriorities = ["Low", "Medium", "High"];

        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid status value",
                error: `Status must be one of: ${validStatuses.join(", ")}`,
            });
        }

        if (priority && !validPriorities.includes(priority)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid priority value",
                error: `Priority must be one of: ${validPriorities.join(", ")}`,
            });
        }

        const updates = {
            ...(title && { title: title.trim() }),
            ...(description && { description: description.trim() }),
            ...(status && { status }),
            ...(priority && { priority }),
            ...(dueDate && { dueDate: new Date(dueDate) }),
        };

        const updatedTask = await taskService.updateTaskById(id, updates);

        if (!updatedTask) {
            return res.status(404).json({
                status: "error",
                message: "Task not found",
                error: `No task exists with ID ${id}`,
            });
        }

        res.status(200).json({
            status: "success",
            message: "Task updated successfully",
            data: updatedTask,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to update task",
            error: error.message,
        });
    }
};

// Delete a task
export const deleteTask = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            message: "Failed to delete task",
            details: `No task with ID ${id}`,
        });
    }

    try {
        const deletedTask = await taskService.deleteTaskById(id);
        if (!deletedTask)
            return res.status(404).json({
                message: "Failed to delete task",
                details: `No task with ID ${id}`,
            });
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete task",
            details: error.message,
        });
    }
};

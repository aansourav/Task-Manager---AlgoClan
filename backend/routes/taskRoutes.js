import express from "express";
import { body } from "express-validator";
import {
    addTask,
    deleteTask,
    getTasks,
    updateTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/tasks", getTasks);

router.post(
    "/tasks",
    [
        body("name").notEmpty().withMessage("Task name is required"),
        body("description").notEmpty().withMessage("Description is required"),
        body("status")
            .isIn(["ToDo", "InProgress", "Done"])
            .withMessage("Invalid status"),
    ],
    addTask
);

router.put(
    "/tasks/:id",
    [
        body("name").optional().notEmpty().withMessage("Task name is required"),
        body("description")
            .optional()
            .notEmpty()
            .withMessage("Description is required"),
        body("status")
            .optional()
            .isIn(["ToDo", "InProgress", "Done"])
            .withMessage("Invalid status"),
    ],
    updateTask
);

router.delete("/tasks/:id", deleteTask);

export default router;

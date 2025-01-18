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
            .isIn(["To Do", "In Progress", "Done"])
            .withMessage("Invalid status"),
        body("priority")
            .optional()
            .isIn(["Low", "Medium", "High"])
            .withMessage("Invalid priority"),
        body("dueDate")
            .optional()
            .isISO8601()
            .withMessage("Invalid date format"),
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
            .isIn(["To Do", "In Progress", "Done"])
            .withMessage("Invalid status"),
        body("priority")
            .optional()
            .isIn(["Low", "Medium", "High"])
            .withMessage("Invalid priority"),
        body("dueDate")
            .optional()
            .isISO8601()
            .withMessage("Invalid date format"),
    ],
    updateTask
);

router.delete("/tasks/:id", deleteTask);

export default router;

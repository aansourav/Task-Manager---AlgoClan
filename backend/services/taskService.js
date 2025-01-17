import Task from "../models/Task.js";

export const getAllTasks = async (page, limit) => {
    const skip = (page - 1) * limit;
    const tasks = await Task.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
    const total = await Task.countDocuments();
    const totalPages = Math.ceil(total / limit);
    return { tasks, total, totalPages };
};

export const createTask = async (taskData) => {
    const newTask = new Task(taskData);
    return await newTask.save();
};

export const updateTaskById = async (id, updates) => {
    return await Task.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
    });
};

export const deleteTaskById = async (id) => {
    return await Task.findByIdAndDelete(id);
};

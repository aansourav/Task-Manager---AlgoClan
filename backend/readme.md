# Task Manager Backend

This is the backend for a Task Manager CRUD application built with Node.js, Express.js, and MongoDB. It provides a RESTful API for managing tasks, including creating, reading, updating, and deleting tasks. The application also supports pagination for efficient data retrieval.

## Features

-   **CRUD Operations**: Create, Read, Update, and Delete tasks.
-   **Pagination**: Efficiently retrieve tasks with pagination support.
-   **Validation**: Input validation using `express-validator` to ensure data integrity.
-   **Error Handling**: Centralized error handling for consistent API responses.
-   **Modular Architecture**: Organized codebase with controllers, services, and models for better maintainability.

## Technologies Used

-   **Node.js**: JavaScript runtime for building the server-side application.
-   **Express.js**: Web framework for building the RESTful API.
-   **MongoDB**: NoSQL database for storing task data.
-   **Mongoose**: ODM for MongoDB, providing a schema-based solution.
-   **dotenv**: For managing environment variables.
-   **express-validator**: Middleware for validating request data.

## Getting Started

### Prerequisites

-   Node.js (v14 or later)
-   MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/yourusername/task-manager-backend.git
    cd task-manager-backend
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following:

    ```
    MONGO_URI=your_mongodb_connection_string
    PORT=4000
    ```

4. **Run the application**:

    ```bash
    npm run dev
    ```

    The server will start on the port specified in the `.env` file (default is 4000).

## API Endpoints

### Tasks

-   **GET /api/tasks**: Fetch all tasks with pagination.

    -   Query Parameters:
        -   `page`: Page number (default: 1)
        -   `limit`: Number of tasks per page (default: 10)
    -   **Response**:
        ```json
        {
          "status": "success",
          "data": {
            "tasks": [...],
            "pagination": {
              "currentPage": 1,
              "totalPages": 5,
              "totalRecords": 50,
              "pageSize": 10
            }
          }
        }
        ```

-   **POST /api/tasks**: Add a new task.

    -   Request Body:
        ```json
        {
            "name": "Task Name",
            "description": "Task Description",
            "status": "pending" // or "in-progress", "completed"
        }
        ```
    -   **Response**:
        ```json
        {
            "status": "success",
            "message": "Task created successfully",
            "data": {
                "_id": "task_id",
                "name": "Task Name",
                "description": "Task Description",
                "status": "pending",
                "createdAt": "2023-01-01T00:00:00.000Z",
                "updatedAt": "2023-01-01T00:00:00.000Z"
            }
        }
        ```

-   **PUT /api/tasks/:id**: Update a task by ID.

    -   Request Body:
        ```json
        {
            "name": "Updated Task Name",
            "description": "Updated Task Description",
            "status": "completed"
        }
        ```
    -   **Response**:
        ```json
        {
            "status": "success",
            "message": "Task updated successfully",
            "data": {
                "_id": "task_id",
                "name": "Updated Task Name",
                "description": "Updated Task Description",
                "status": "completed",
                "createdAt": "2023-01-01T00:00:00.000Z",
                "updatedAt": "2023-01-02T00:00:00.000Z"
            }
        }
        ```

-   **DELETE /api/tasks/:id**: Delete a task by ID.
    -   **Response**:
        ```json
        {
            "status": "success",
            "message": "Task deleted successfully"
        }
        ```

## Error Handling

The API provides consistent error responses with a `message` and `details` property to help with debugging and understanding issues. Here are some examples:

-   **Validation Errors**:

    ```json
    {
        "status": "error",
        "message": "Validation failed",
        "errors": [
            {
                "field": "name",
                "message": "Name is required"
            }
        ]
    }
    ```

-   **Database Errors**:

    ```json
    {
        "status": "error",
        "message": "Failed to fetch tasks",
        "error": "Database connection error"
    }
    ```

-   **Not Found Errors**:
    ```json
    {
        "status": "error",
        "message": "Task not found",
        "error": "No task exists with ID 12345"
    }
    ```


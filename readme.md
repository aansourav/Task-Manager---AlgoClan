# Task Manager

A modern, responsive task management application built with Next.js, React Query, and Tailwind CSS. This application provides a comprehensive interface for managing tasks with features like real-time updates, optimistic updates, and a responsive design.

## Features

### Core Functionality

-   **CRUD Operations**
    -   Create new tasks with title, description, status, priority, and due date
    -   Read/View tasks in a responsive grid layout
    -   Update task details and status
    -   Delete tasks with confirmation dialog

### Task Properties

-   **Status Management**

    -   To Do
    -   In Progress
    -   Done
    -   Visual indicators with different colored icons
    -   Quick status change via popover menu

-   **Priority Levels**
    -   Low (Green)
    -   Medium (Yellow)
    -   High (Red)
    -   Color-coded badges for easy identification

### UI/UX Features

-   **Responsive Design**

    -   Grid layout adapts to screen size
    -   Mobile-friendly interface
    -   Smooth animations and transitions

-   **Loading States**

    -   Skeleton loading animation during data fetching
    -   Loading indicators for user actions
    -   Error handling with user-friendly messages

-   **Toast Notifications**

    -   Success messages for task operations
    -   Error notifications
    -   Auto-dismissing notifications

-   **Interactive Components**
    -   Modal forms for task creation/editing
    -   Confirmation dialogs for destructive actions
    -   Dropdown menus for actions
    -   Popovers for quick status changes

### Advanced Features

-   **Data Management**

    -   Real-time updates with React Query
    -   Optimistic updates for better UX
    -   Automatic background refetching
    -   Pagination support

-   **Error Handling**
    -   Graceful error handling
    -   Retry mechanisms for failed requests
    -   User-friendly error messages

## UI Screenshots

![alt text](<Screenshot 2025-01-18 155241.png>) ![alt text](<Screenshot 2025-01-18 155254.png>) ![alt text](<Screenshot 2025-01-18 155318.png>) ![alt text](<Screenshot 2025-01-18 155328.png>) ![alt text](<Screenshot 2025-01-18 155341.png>) ![alt text](<Screenshot 2025-01-18 155356.png>)

# Task Manager Backend

Task Manager Backend CRUD application is built with Node.js, Express.js, and MongoDB. It provides a RESTful API for managing tasks, including creating, reading, updating, and deleting tasks. The application also supports pagination for efficient data retrieval.

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

## Installation

### Setup backend

1. **Clone the repository**:

    ```bash
    git clone https://github.com/aansourav/Task-Manager---AlgoClan.git
    cd Task-Manager---AlgoClan
    ```

2. **Set up environment variables in backend**:
   Create a `.env` file in the root of the backend directory and add the following:

    ```
    MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<collection>?retryWrites=true&w=majority
    PORT=4000
    ```

3. **Run the backend server**:
    ```bash
     cd ./backend
     npm install
     npm run dev
    ```

The server will start on the port specified in the `.env` file (default is `4000`).

### Setup frontend

**Open another terminal in the backend directory**
**Then give the following commands**

```bash
    npm install
    npm run dev
```

**The front will start on the port localhost:3000**

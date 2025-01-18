# Task Manager

A modern, responsive task management application built with Next.js, React Query, and Tailwind CSS. This application provides a comprehensive interface for managing tasks with features like real-time updates, optimistic updates, and a responsive design.

## Features

### Core Functionality
- **CRUD Operations**
  - Create new tasks with title, description, status, priority, and due date
  - Read/View tasks in a responsive grid layout
  - Update task details and status
  - Delete tasks with confirmation dialog

### Task Properties
- **Status Management**
  - To Do
  - In Progress
  - Done
  - Visual indicators with different colored icons
  - Quick status change via popover menu

- **Priority Levels**
  - Low (Green)
  - Medium (Yellow)
  - High (Red)
  - Color-coded badges for easy identification

### UI/UX Features
- **Responsive Design**
  - Grid layout adapts to screen size
  - Mobile-friendly interface
  - Smooth animations and transitions

- **Loading States**
  - Skeleton loading animation during data fetching
  - Loading indicators for user actions
  - Error handling with user-friendly messages

- **Toast Notifications**
  - Success messages for task operations
  - Error notifications
  - Auto-dismissing notifications

- **Interactive Components**
  - Modal forms for task creation/editing
  - Confirmation dialogs for destructive actions
  - Dropdown menus for actions
  - Popovers for quick status changes

### Advanced Features
- **Data Management**
  - Real-time updates with React Query
  - Optimistic updates for better UX
  - Automatic background refetching
  - Pagination support

- **Error Handling**
  - Graceful error handling
  - Retry mechanisms for failed requests
  - User-friendly error messages

# Task Manager Full Stack Application

## Overview
This is a full-stack task management application built with Angular (client) and ASP.NET Core (server). The client provides a user interface for managing tasks, while the server offers REST API endpoints for CRUD operations on tasks stored in a JSON file.

## Technologies Used
- **Client**: Angular 21, Bootstrap 5, Reactive Forms
- **Server**: ASP.NET Core 7.0, C#
- **Data Storage**: JSON file

## Features
- Add new tasks with title, description, priority, due date, and status
- View list of all tasks
- Edit existing tasks
- Delete tasks
- Responsive design using Bootstrap

## Running the Application

### Prerequisites
- Docker and Docker Compose installed
- Node.js (for local development)
- .NET 7.0 SDK (for local development)

### Using Docker Compose (Recommended)
1. Clone the repository
2. Navigate to the project root directory
3. Run `docker-compose up`
4. Open your browser and go to:
   - Client: http://localhost:4200
   - Server API: http://localhost:5000/swagger (for API documentation)

### Local Development
#### Client
1. Navigate to `client` directory
2. Run `npm install`
3. Run `npm start`
4. Open http://localhost:4200

#### Server
1. Navigate to `server` directory
2. Run `dotnet run`
3. API will be available at http://localhost:5000

## API Endpoints
- `GET /tasks` - Get all tasks
- `POST /tasks` - Add a new task
- `PUT /tasks/{id}` - Update a task by ID
- `DELETE /tasks/{id}` - Delete a task by ID

## Task Model
```json
{
  "id": 1,
  "title": "Task Title",
  "description": "Task Description",
  "priority": "גבוהה|בינונית|נמוכה",
  "dueDate": "2025-01-15",
  "status": "ממתינה|בתהליך|הושלמה"
}
```
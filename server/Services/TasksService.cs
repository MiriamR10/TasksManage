using System.Text.Json;
using TaskManagerServer.Models;

namespace TaskManagerServer.Services;

public class TasksService
{
    private readonly string _filePath = "tasks-db.json";
    private List<Task> _tasks = new();
    private int _nextId = 1;

    public TasksService()
    {
        LoadTasksFromFile();
    }

    private void LoadTasksFromFile()
    {
        try
        {
            if (File.Exists(_filePath))
            {
                var json = File.ReadAllText(_filePath);
                _tasks = JsonSerializer.Deserialize<List<Task>>(json) ?? new List<Task>();

                // קבע את ה-ID הבא
                if (_tasks.Any())
                {
                    _nextId = _tasks.Max(t => t.Id ?? 0) + 1;
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error loading tasks: {ex.Message}");
            _tasks = new List<Task>();
        }
    }

    private void SaveTasksToFile()
    {
        try
        {
            var json = JsonSerializer.Serialize(_tasks, new JsonSerializerOptions
            {
                WriteIndented = true,
                Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            });
            File.WriteAllText(_filePath, json);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error saving tasks: {ex.Message}");
        }
    }

    public IEnumerable<Task> GetAllTasks()
    {
        return _tasks.Where(t => t.Id.HasValue); // מחזיר רק משימות עם ID תקף
    }

    public Task? GetTaskById(int id)
    {
        return _tasks.FirstOrDefault(t => t.Id == id);
    }

    public Task AddTask(Task task)
    {
        task.Id = _nextId++;
        _tasks.Add(task);
        SaveTasksToFile();
        return task;
    }

    public Task? UpdateTask(int id, Task updatedTask)
    {
        var existingTask = _tasks.FirstOrDefault(t => t.Id == id);
        if (existingTask == null)
        {
            return null;
        }

        // עדכן את השדות
        existingTask.Title = updatedTask.Title;
        existingTask.Description = updatedTask.Description;
        existingTask.Priority = updatedTask.Priority;
        existingTask.DueDate = updatedTask.DueDate;
        existingTask.Status = updatedTask.Status;

        SaveTasksToFile();
        return existingTask;
    }

    public bool DeleteTask(int id)
    {
        var task = _tasks.FirstOrDefault(t => t.Id == id);
        if (task == null)
        {
            return false;
        }

        _tasks.Remove(task);
        SaveTasksToFile();
        return true;
    }
}
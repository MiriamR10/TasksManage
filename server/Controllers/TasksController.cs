using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using TaskManagerServer.Models;

namespace TaskManagerServer.Controllers;

[ApiController]
[Route("api/tasks")]
public class TasksController : ControllerBase
{
    private readonly string _filePath = "tasks.json";

    [HttpGet]
    public IActionResult GetTasks()
    {
        if (!System.IO.File.Exists(_filePath))
        {
            return Ok(new List<TaskManagerServer.Models.Task>());
        }

        var json = System.IO.File.ReadAllText(_filePath);
        var tasks = JsonSerializer.Deserialize<List<TaskManagerServer.Models.Task>>(json) ?? new List<TaskManagerServer.Models.Task>();
        return Ok(tasks);
    }

    [HttpGet("{id}")]
    public IActionResult GetTaskById(int id)
    {
        var tasks = GetTasksList();
        var task = tasks.FirstOrDefault(t => t.Id == id);
        if (task == null)
        {
            return NotFound();
        }
        return Ok(task);
    }

    [HttpPost]
    public IActionResult AddTask([FromBody] TaskManagerServer.Models.Task task)
    {
        var tasks = GetTasksList();
        task.Id = tasks.Count > 0 ? tasks.Max(t => t.Id ?? 0) + 1 : 1;
        tasks.Add(task);
        SaveTasks(tasks);
        return CreatedAtAction(nameof(GetTasks), new { id = task.Id }, task);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateTask(int id, [FromBody] TaskManagerServer.Models.Task updatedTask)
    {
        var tasks = GetTasksList();
        var task = tasks.FirstOrDefault(t => t.Id == id);
        if (task == null)
        {
            return NotFound();
        }

        task.Title = updatedTask.Title;
        task.Description = updatedTask.Description;
        task.Priority = updatedTask.Priority;
        task.DueDate = updatedTask.DueDate;
        task.Status = updatedTask.Status;

        SaveTasks(tasks);
        return Ok(task);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteTask(int id)
    {
        var tasks = GetTasksList();
        var task = tasks.FirstOrDefault(t => t.Id == id);
        if (task == null)
        {
            return NotFound();
        }

        tasks.Remove(task);
        SaveTasks(tasks);
        return NoContent();
    }

    private List<TaskManagerServer.Models.Task> GetTasksList()
    {
        if (!System.IO.File.Exists(_filePath))
        {
            return new List<TaskManagerServer.Models.Task>();
        }

        var json = System.IO.File.ReadAllText(_filePath);
        return JsonSerializer.Deserialize<List<TaskManagerServer.Models.Task>>(json) ?? new List<TaskManagerServer.Models.Task>();
    }

    private void SaveTasks(List<TaskManagerServer.Models.Task> tasks)
    {
        var json = JsonSerializer.Serialize(tasks, new JsonSerializerOptions { WriteIndented = true });
        System.IO.File.WriteAllText(_filePath, json);
    }
}
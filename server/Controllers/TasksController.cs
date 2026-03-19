using Microsoft.AspNetCore.Mvc;
using TaskManagerServer.Models;
using TaskManagerServer.Services;

namespace TaskManagerServer.Controllers;

[ApiController]
[Route("api/tasks")]
public class TasksController : ControllerBase
{
    private readonly TasksService _tasksService;

    public TasksController(TasksService tasksService)
    {
        _tasksService = tasksService;
    }

    [HttpGet]
    public IActionResult GetTasks()
    {
        var tasks = _tasksService.GetAllTasks();
        return Ok(tasks);
    }

    [HttpGet("{id}")]
    public IActionResult GetTaskById(int id)
    {
        var task = _tasksService.GetTaskById(id);
        if (task == null)
        {
            return NotFound();
        }
        return Ok(task);
    }

    [HttpPost]
    public IActionResult AddTask([FromBody] Task task)
    {
        var addedTask = _tasksService.AddTask(task);
        return CreatedAtAction(nameof(GetTasks), new { id = addedTask.Id }, addedTask);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateTask(int id, [FromBody] Task updatedTask)
    {
        var task = _tasksService.UpdateTask(id, updatedTask);
        if (task == null)
        {
            return NotFound();
        }
        return Ok(task);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteTask(int id)
    {
        var deleted = _tasksService.DeleteTask(id);
        if (!deleted)
        {
            return NotFound();
        }
        return NoContent();
    }
}
namespace TaskManagerServer.Models;

public class Task
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Priority { get; set; } = "נמוכה";
    public string DueDate { get; set; } = string.Empty;
    public string Status { get; set; } = "ממתינה";
}

import { Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task, TaskPriority, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks = signal<Task[]>([]);
  private taskService = inject(TaskService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadTasks();
    }
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks.set(tasks);
    });
  }

  editTask(task: Task) {
    // Set current task in service store
    this.taskService.setCurrentTask(task);
    // Navigate to edit route
    this.router.navigate(['/edit', task.id]);
  }

  deleteTask(id: number) {
    if (confirm('אתה בטוח שברצונך למחוק משימה זו?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.loadTasks();
      });
    }
  }

  getPriorityClass(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.Low:
        return 'bg-success';
      case TaskPriority.Medium:
        return 'bg-warning text-dark';
      case TaskPriority.High:
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  getStatusClass(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.Pending:
        return 'bg-secondary';
      case TaskStatus.InProgress:
        return 'bg-primary';
      case TaskStatus.Done:
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('he-IL');
  }
}

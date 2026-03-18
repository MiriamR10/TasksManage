import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { TASK_PRIORITIES, TASK_STATUSES, TaskPriority, TaskStatus } from '../../models/task.enums';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  priorities = TASK_PRIORITIES;
  statuses = TASK_STATUSES;
  isEdit = false;
  taskId: number | null = null;
  isLoading = false;
  title = 'הוספת משימה חדשה';
  buttonText = 'הוספה';

  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      priority: [TaskPriority.Medium, Validators.required],
      dueDate: ['', Validators.required],
      status: [TaskStatus.Pending, Validators.required]
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.route.paramMap.subscribe(params => {
        const idStr = params.get('id');
        const parsed = idStr ? parseInt(idStr, 10) : NaN;
        if (!isNaN(parsed)) {
          this.isEdit = true;
          this.title = '✏️ עריכת משימה';
          this.buttonText = 'עדכון';
          this.taskId = parsed;
          this.loadTask(parsed);
        }
      });
    }
  }

  loadTask(id: number) {
    // First, try to get task from service store (faster)
    const currentTask = this.taskService.getCurrentTask();
    if (currentTask && currentTask.id === id) {
      this.taskForm.patchValue(currentTask);
      return;
    }

    // Otherwise, fetch from API
    this.isLoading = true;
    this.taskService.getTaskById(id).subscribe({
      next: (task) => {
        this.taskService.setCurrentTask(task);
        this.taskForm.patchValue(task);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading task:', err);
        this.isLoading = false;
        alert('שגיאה בטעינת המשימה');
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit() {
    // Make sure validation messages appear even if the user didn't touch the fields.
    this.taskForm.markAllAsTouched();

    if (!this.taskForm.valid || !isPlatformBrowser(this.platformId)) {
      return;
    }

    const task = this.taskForm.value;
    if (this.isEdit && this.taskId) {
      this.taskService.updateTask(this.taskId, task).subscribe({
        next: () => {
          this.taskService.setCurrentTask(null); // Clear store
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error updating task:', err);
          alert('שגיאה בעדכון המשימה');
        }
      });
    } else {
      this.taskService.addTask(task).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}

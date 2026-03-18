import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { TASK_PRIORITIES, TASK_STATUSES, TaskPriority, TaskStatus } from '../../models/task.enums';

@Component({
  selector: 'app-task-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './task-add.component.html',
  styleUrls: ['./task-add.component.scss']
})
export class TaskAddComponent {
  taskForm: FormGroup;
  priorities = TASK_PRIORITIES;
  statuses = TASK_STATUSES;

  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private router = inject(Router);
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

  onSubmit() {
    // Make sure validation messages appear even if the user didn't touch the fields.
    this.taskForm.markAllAsTouched();

    if (!this.taskForm.valid || !isPlatformBrowser(this.platformId)) {
      return;
    }

    const task = this.taskForm.value;
    this.taskService.addTask(task).subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}

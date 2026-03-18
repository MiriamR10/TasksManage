import { Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskAddComponent } from './components/task-add/task-add.component';
import { TaskEditComponent } from './components/task-edit/task-edit.component';

export const routes: Routes = [
  { path: '', component: TaskListComponent },
  { path: 'new', component: TaskAddComponent },
  { path: 'edit/:id', component: TaskEditComponent },
  { path: '**', redirectTo: '' }
];

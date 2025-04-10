import { Routes } from '@angular/router';
import { TodoListsComponent } from './pages/todo-lists/todo-lists.component';
import { TodoListDetailComponent } from './pages/todo-list-detail/todo-list-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'todo', pathMatch: 'full' },
  { path: 'todo', component: TodoListsComponent },
  { path: 'todo/:id', component: TodoListDetailComponent },
];

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TodoList } from '../../core/models/todo.models';
import { TodoService } from '../../core/services/todo.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-todo-list-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  templateUrl: './todo-list-detail.component.html',
  styleUrls: ['./todo-list-detail.component.css'],
})
export class TodoListDetailComponent implements OnInit {
  todoList: TodoList | undefined;
  form: FormGroup;
  listId = '';

  constructor(
    private route: ActivatedRoute,
    private todoService: TodoService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    // Initialize form with validation
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Get list ID from route params
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.listId = idParam;
        this.loadList();
      }
    });
  }

  // Fetch the list details from the backend
  loadList(): void {
    this.todoService.getTodoListById(this.listId).subscribe((list) => {
      this.todoList = list;
    });
  }

  // Navigate back to the list view
  goBack(): void {
    this.router.navigate(['/todo']);
  }

  // Add a new task to the current list
  addTask(): void {
    if (this.form.valid) {
      const { title, description } = this.form.value;

      this.todoService
        .addTaskToList(this.listId, title.trim(), description.trim())
        .subscribe(() => {
          // Show confirmation
          this.snackBar.open('New task added!', 'Close', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });

          // Reset the form after submission
          this.form.reset();
          Object.keys(this.form.controls).forEach((field) => {
            const control = this.form.get(field);
            control?.setErrors(null);
            control?.markAsPristine();
            control?.markAsUntouched();
          });

          // Reload the list to show the new task
          this.loadList();
        });
    }
  }

  // Toggle task completion status
  toggleTask(taskId: number): void {
    this.todoService.toggleTaskCompletion(this.listId, taskId).subscribe(() => {
      this.loadList(); // Refresh list after update
    });
  }
}

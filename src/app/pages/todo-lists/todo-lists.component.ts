import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Task, TodoList } from '../../core/models/todo.models';
import { TodoService } from '../../core/services/todo.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-todo-lists',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './todo-lists.component.html',
  styleUrls: ['./todo-lists.component.css'],
})
export class TodoListsComponent implements OnInit {
  todoLists: TodoList[] = []; // Array to hold all the to-do lists
  form: FormGroup; // Reactive form for creating a new list

  constructor(
    private todoService: TodoService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    // Initialize form with a single title field and required validator
    this.form = this.fb.group({
      title: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Load all lists from the backend when component initializes
    this.todoService.loadLists();

    // Subscribe to the BehaviorSubject to stay updated with changes
    this.todoService.todoLists$.subscribe((lists) => {
      this.todoLists = lists;
    });
  }

  // Utility method to count completed tasks within a list
  countCompleted(tasks: Task[]): number {
    return tasks.filter((task) => task.completed).length;
  }

  // Adds a new to-do list if the form is valid
  addList(): void {
    if (this.form.valid) {
      const title = this.form.value.title.trim();

      if (title) {
        this.todoService.addTodoList(title).subscribe(() => {
          // Show toast/snackbar message on successful creation
          this.snackBar.open('New list added!', 'Close', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });

          // Reset the form state after submission
          this.form.reset();
          Object.keys(this.form.controls).forEach((field) => {
            const control = this.form.get(field);
            control?.setErrors(null);
            control?.markAsPristine();
            control?.markAsUntouched();
          });
        });
      }
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TodoList, Task } from '../models/todo.models';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  // Base URL for JSON server
  private readonly baseUrl = 'http://localhost:3000/lists';

  // Subject to store and emit the current list of todo lists
  private todoListsSubject = new BehaviorSubject<TodoList[]>([]);
  todoLists$ = this.todoListsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Helper to safely access localStorage
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // Loads all todo lists from localStorage or backend and pushes to the subject
  loadLists(): void {
    if (this.isBrowser()) {
      const localData = localStorage.getItem('todoLists');
      if (localData) {
        this.todoListsSubject.next(JSON.parse(localData));
        return;
      }
    }

    this.http.get<TodoList[]>(this.baseUrl).subscribe((lists) => {
      this.todoListsSubject.next(lists);
      if (this.isBrowser()) {
        localStorage.setItem('todoLists', JSON.stringify(lists));
      }
    });
  }

  // Fetches a specific todo list by its ID
  getTodoListById(id: string): Observable<TodoList> {
    return this.http.get<TodoList>(`${this.baseUrl}/${id}`);
  }

  // Adds a new todo list and updates the subject
  addTodoList(title: string): Observable<TodoList> {
    const newList: TodoList = {
      id: Date.now().toString(),
      title,
      tasks: [],
    };

    return this.http.post<TodoList>(this.baseUrl, newList).pipe(
      tap((createdList) => {
        const current = this.todoListsSubject.getValue();
        const updated = [...current, createdList];
        this.todoListsSubject.next(updated);
        if (this.isBrowser()) {
          localStorage.setItem('todoLists', JSON.stringify(updated));
        }
      })
    );
  }

  // Adds a new task to a list and updates the subject
  addTaskToList(listId: string, title: string, description: string): Observable<TodoList> {
    return this.getTodoListById(listId).pipe(
      switchMap((list) => {
        const newTask: Task = {
          id: Date.now(),
          title,
          description,
          completed: false,
        };

        const updatedList: TodoList = {
          ...list,
          tasks: [...list.tasks, newTask],
        };

        return this.http
          .put<TodoList>(`${this.baseUrl}/${listId}`, updatedList)
          .pipe(tap(() => this.updateListInSubject(updatedList)));
      })
    );
  }

  // Toggles the completion state of a task and updates the subject
  toggleTaskCompletion(listId: string, taskId: number): Observable<TodoList> {
    return this.getTodoListById(listId).pipe(
      switchMap((list) => {
        const updatedTasks = list.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );

        const updatedList: TodoList = {
          ...list,
          tasks: updatedTasks,
        };

        return this.http
          .put<TodoList>(`${this.baseUrl}/${listId}`, updatedList)
          .pipe(tap(() => this.updateListInSubject(updatedList)));
      })
    );
  }

  // Updates the list in the subject and localStorage with the new version
  private updateListInSubject(updatedList: TodoList): void {
    const current = this.todoListsSubject.getValue();
    const updated = current.map((list) => (list.id === updatedList.id ? updatedList : list));
    this.todoListsSubject.next(updated);

    if (this.isBrowser()) {
      localStorage.setItem('todoLists', JSON.stringify(updated));
    }
  }
}

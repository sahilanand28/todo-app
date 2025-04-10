import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoListsComponent } from './todo-lists.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { TodoService } from '../../core/services/todo.service';
import { TodoList } from '../../core/models/todo.models';

class MockTodoService {
  todoLists$ = of([
    { id: '1', title: 'List 1', tasks: [{ id: 1, title: 'T1', description: '', completed: true }] },
    { id: '2', title: 'List 2', tasks: [{ id: 2, title: 'T2', description: '', completed: false }] }
  ]);
  loadLists = jasmine.createSpy('loadLists');
  addTodoList = jasmine.createSpy('addTodoList').and.returnValue(of({ id: '3', title: 'New List', tasks: [] }));
}

describe('TodoListsComponent (Extended)', () => {
  let component: TodoListsComponent;
  let fixture: ComponentFixture<TodoListsComponent>;
  let service: MockTodoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListsComponent, ReactiveFormsModule, MatSnackBarModule],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: TodoService, useClass: MockTodoService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListsComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(TodoService) as any;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load lists on init and subscribe to todoLists$', () => {
    expect(service.loadLists).toHaveBeenCalled();
    expect(component.todoLists.length).toBe(2);
  });

  it('should correctly count completed tasks', () => {
    const tasks = [
      { id: 1, title: 'T1', description: '', completed: true },
      { id: 2, title: 'T2', description: '', completed: false },
      { id: 3, title: 'T3', description: '', completed: true }
    ];
    expect(component.countCompleted(tasks)).toBe(2);
  });

  it('should add a new list and reset the form', () => {
    component.form.setValue({ title: 'New List' });
    component.addList();

    expect(service.addTodoList).toHaveBeenCalledWith('New List');
    expect(component.form.get('title')?.value).toBeNull();
    expect(component.form.pristine).toBeTrue();
  });

  it('should not call addTodoList if form is invalid', () => {
    component.form.setValue({ title: '' });
    component.addList();
    expect(service.addTodoList).not.toHaveBeenCalled();
  });
});
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoListDetailComponent } from './todo-list-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { TodoService } from '../../core/services/todo.service';
import { TodoList } from '../../core/models/todo.models';

const mockList: TodoList = {
  id: '1',
  title: 'Sample List',
  tasks: [
    { id: 1, title: 'Task 1', description: 'Desc 1', completed: false },
    { id: 2, title: 'Task 2', description: 'Desc 2', completed: true }
  ]
};

class MockTodoService {
  getTodoListById = jasmine.createSpy('getTodoListById').and.returnValue(of(mockList));
  addTaskToList = jasmine.createSpy('addTaskToList').and.returnValue(of(mockList));
  toggleTaskCompletion = jasmine.createSpy('toggleTaskCompletion').and.returnValue(of(mockList));
}

describe('TodoListDetailComponent (Full)', () => {
  let component: TodoListDetailComponent;
  let fixture: ComponentFixture<TodoListDetailComponent>;
  let service: MockTodoService;
  let routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListDetailComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: TodoService, useClass: MockTodoService },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => '1' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListDetailComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(TodoService) as any;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load list on init with correct ID', () => {
    expect(service.getTodoListById).toHaveBeenCalledWith('1');
    expect(component.todoList?.id).toBe('1');
  });

  it('should navigate back to /todo on goBack()', () => {
    component.goBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/todo']);
  });

  it('should add a task and reset form', () => {
    component.form.setValue({ title: 'New Task', description: 'Desc' });
    component.addTask();

    expect(service.addTaskToList).toHaveBeenCalledWith('1', 'New Task', 'Desc');
    expect(component.form.get('title')?.value).toBeNull();
    expect(component.form.get('description')?.value).toBeNull();
  });

  it('should not call addTask if form is invalid', () => {
    component.form.setValue({ title: '', description: '' });
    component.addTask();

    expect(service.addTaskToList).not.toHaveBeenCalled();
  });

  it('should toggle task completion and reload list', () => {
    component.toggleTask(1);
    expect(service.toggleTaskCompletion).toHaveBeenCalledWith('1', 1);
  });
});
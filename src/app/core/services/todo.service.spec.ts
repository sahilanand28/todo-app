import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TodoService } from './todo.service';
import { TodoList, Task } from '../models/todo.models';

describe('TodoService (Extended Tests)', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TodoService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load todo lists and update todoLists$', () => {
    const dummyLists: TodoList[] = [
      { id: '1', title: 'List 1', tasks: [] },
      { id: '2', title: 'List 2', tasks: [] }
    ];

    let result: TodoList[] = [];
    service.todoLists$.subscribe((lists) => (result = lists));

    service.loadLists();
    const req = httpMock.expectOne('http://localhost:3000/lists');
    expect(req.request.method).toBe('GET');
    req.flush(dummyLists);

    expect(result).toEqual(dummyLists);
  });

  it('should get a list by ID', () => {
    const mockList: TodoList = { id: '1', title: 'List 1', tasks: [] };

    service.getTodoListById('1').subscribe((list) => {
      expect(list).toEqual(mockList);
    });

    const req = httpMock.expectOne('http://localhost:3000/lists/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockList);
  });

  it('should add a new todo list and update BehaviorSubject', () => {
    const newTitle = 'New List';
    const mockList: TodoList = { id: '123', title: newTitle, tasks: [] };
    spyOn(Date, 'now').and.returnValue(123);

    let result: TodoList[] = [];
    service.todoLists$.subscribe((lists) => (result = lists));

    service.addTodoList(newTitle).subscribe((list) => {
      expect(list).toEqual(mockList);
      expect(result).toContain(mockList);
    });

    const req = httpMock.expectOne('http://localhost:3000/lists');
    expect(req.request.method).toBe('POST');
    req.flush(mockList);
  });

  it('should add a task to a list and update the subject', () => {
    const initialList: TodoList = { id: '1', title: 'List', tasks: [] };
    const updatedList: TodoList = {
      ...initialList,
      tasks: [{ id: 456, title: 'Task', description: 'Desc', completed: false }]
    };

    spyOn(Date, 'now').and.returnValue(456);

    service.addTaskToList('1', 'Task', 'Desc').subscribe((list) => {
      expect(list).toEqual(updatedList);
    });

    httpMock.expectOne('http://localhost:3000/lists/1').flush(initialList);
    httpMock.expectOne('http://localhost:3000/lists/1').flush(updatedList);
  });

  it('should toggle task completion and update subject', () => {
    const initialTask: Task = { id: 789, title: 'Task', description: 'Desc', completed: false };
    const initialList: TodoList = { id: '1', title: 'List', tasks: [initialTask] };
    const updatedTask: Task = { ...initialTask, completed: true };
    const updatedList: TodoList = { ...initialList, tasks: [updatedTask] };

    service.toggleTaskCompletion('1', 789).subscribe((list) => {
      expect(list.tasks[0].completed).toBeTrue();
      expect(list).toEqual(updatedList);
    });

    httpMock.expectOne('http://localhost:3000/lists/1').flush(initialList);
    httpMock.expectOne('http://localhost:3000/lists/1').flush(updatedList);
  });

  it('should not modify other tasks when toggling one', () => {
    const initialList: TodoList = {
      id: '1',
      title: 'List',
      tasks: [
        { id: 1, title: 'Task 1', description: 'Desc 1', completed: false },
        { id: 2, title: 'Task 2', description: 'Desc 2', completed: true }
      ]
    };
  
    const expectedUpdatedList: TodoList = {
      ...initialList,
      tasks: [
        { id: 1, title: 'Task 1', description: 'Desc 1', completed: true }, // toggled
        { id: 2, title: 'Task 2', description: 'Desc 2', completed: true }  // unchanged
      ]
    };
  
    service.toggleTaskCompletion('1', 1).subscribe((list) => {
      expect(list).toEqual(expectedUpdatedList);
    });
  
    httpMock.expectOne('http://localhost:3000/lists/1').flush(initialList);
    httpMock.expectOne('http://localhost:3000/lists/1').flush(expectedUpdatedList);
  });

  it('should replace the correct list in updateListInSubject', () => {
    const list1: TodoList = { id: '1', title: 'List 1', tasks: [] };
    const list2: TodoList = { id: '2', title: 'List 2', tasks: [] };
    const updatedList2: TodoList = { id: '2', title: 'Updated List 2', tasks: [] };

    service['todoListsSubject'].next([list1, list2]);
    service['updateListInSubject'](updatedList2);

    service.todoLists$.subscribe((lists) => {
      expect(lists.length).toBe(2);
      expect(lists.find((l) => l.id === '2')?.title).toBe('Updated List 2');
    });
  });
});
import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Todo} from './todo';
import {TodoListComponent} from './todo-list.component';
import {TodoListService} from './todo-list.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';
import {TodoComponent} from './todo.component';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

describe('Todo list', () => {

  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  let todoListServiceStub: {
    getTodos: () => Observable<Todo[]>
  };

  beforeEach(() => {
    // stub TodoService for test purposes
    todoListServiceStub = {
      getTodos: () => Observable.of([
        {
          _id: '58af3a600343927e48e8720f',
          owner:'Blanche',
          category: 'software design',
          body: 'In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. Cillum non labore ex sint esse.',
          status: 'false',
        },

        {
          _id: '58af3a600343927e48e87210',
          owner:'Fry',
          category: 'video games',
          body: 'Ipsum esse est ullamco magna tempor anim laborum non officia deserunt veniam commodo. Aute minim incididunt ex commodo.',
          status: 'false',
        },

        {
          _id: '58af3a600343927e48e87211',
          owner:'Fry',
          category: 'homework',
          body: 'Ullamco irure laborum magna dolor non. Anim occaecat adipisicing cillum eu magna in.',
          status: 'true',
        }
      ])
    };

    TestBed.configureTestingModule({
      imports: [CustomModule],
      declarations: [TodoListComponent],
      // providers:    [ TodoListService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{provide: TodoListService, useValue: todoListServiceStub},
        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('contains all the todos', () => {
    expect(todoList.todos.length).toBe(3);
  });

  it('contains a todo named \'Blanche\'', () => {
    expect(todoList.todos.some((todo: Todo) => todo.owner === 'Chris')).toBe(true);
  });

  it('contain a todo named \'Fry\'', () => {
    expect(todoList.todos.some((todo: Todo) => todo.owner === 'Jamie')).toBe(true);
  });

  it('doesn\'t contain a todo named \'Santa\'', () => {
    expect(todoList.todos.some((todo: Todo) => todo.owner === 'Santa')).toBe(false);
  });

});

describe('Misbehaving Todo List', () => {
  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  let todoListServiceStub: {
    getTodos: () => Observable<Todo[]>
  };

  beforeEach(() => {
    // stub TodoService for test purposes
    todoListServiceStub = {
      getTodos: () => Observable.create(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, CustomModule],
      declarations: [TodoListComponent],
      providers: [{provide: TodoListService, useValue: todoListServiceStub},
        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up a TodoListService', () => {
    // Since the observer throws an error, we don't expect todos to be defined.
    expect(todoList.todos).toBeUndefined();
  });
});


describe('Adding a todo', () => {
  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  const newTodo: Todo =

    {
      _id: '58af3a600343927e48e87211',
      owner:'Fry',
      category: 'homework',
      body: 'Ullamco irure laborum magna dolor non. Anim occaecat adipisicing cillum eu magna in.',
      status: 'true',
    };


  const newId = 'Fry_id';

  let calledTodo: Todo;

  let todoListServiceStub: {
    getTodos: () => Observable<Todo[]>,
    addNewTodo: (newTodo: Todo) => Observable<{ '$oid': string }>
  };
  let mockMatDialog: {
    open: (AddTodoComponent, any) => {
      afterClosed: () => Observable<Todo>
    };
  };

  beforeEach(() => {
    calledTodo = null;
    // stub TodoService for test purposes
    todoListServiceStub = {
      getTodos: () => Observable.of([]),
      addNewTodo: (newTodo: Todo) => {
        calledTodo = newTodo;
        return Observable.of({
          '$oid': newId
        });
      }
    };
    mockMatDialog = {
      open: () => {
        return {
          afterClosed: () => {
            return Observable.of(newTodo);
          }
        };
      }
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, CustomModule],
      declarations: [TodoListComponent],
      providers: [
        {provide: TodoListService, useValue: todoListServiceStub},
        {provide: MatDialog, useValue: mockMatDialog},
        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('calls TodoListService.addTodo', () => {
    expect(calledTodo).toBeNull();
    todoList.openDialog();
    expect(calledTodo).toEqual(newTodo);
  });
});

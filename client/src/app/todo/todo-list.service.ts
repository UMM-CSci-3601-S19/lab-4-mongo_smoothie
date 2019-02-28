import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {Todo} from './todo';
import {environment} from '../../environments/environment';


@Injectable()
export class TodoListService {
  readonly baseUrl: string = environment.API_URL + 'todos';
  private todoUrl: string = this.baseUrl;

  constructor(private http: HttpClient) {
  }

  getTodos(todo_id?: string): Observable<Todo[]> {
    this.filterBy_id(todo_id);
    return this.http.get<Todo[]>(this.todoUrl);
  }

  getTodoById(id: string): Observable<Todo> {
    return this.http.get<Todo>(this.todoUrl + '/' + id);
  }

  /*
  //This method looks lovely and is more compact, but it does not clear previous searches appropriately.
  //It might be worth updating it, but it is currently commented out since it is not used (to make that clear)
  getTodosBy_id(todo_id?: string): Observable<Todo> {
      this.todoUrl = this.todoUrl + (!(todo_id == null || todo_id == "") ? "?_id=" + todo_id : "");
      console.log("The url is: " + this.todoUrl);
      return this.http.request(this.todoUrl).map(res => res.json());
  }
  */

  filterBy_id(todo_id?: string): void {
    if (!(todo_id == null || todo_id === '')) {
      if (this.parameterPresent('_id=')) {
        // there was a previous search by _id that we need to clear
        this.removeParameter('_id=');
      }
      if (this.todoUrl.indexOf('?') !== -1) {
        // there was already some information passed in this url
        this.todoUrl += '_id=' + todo_id + '&';
      } else {
        // this was the first bit of information to pass in the url
        this.todoUrl += '?_id=' + todo_id + '&';
      }
    } else {
      // there was nothing in the box to put onto the URL... reset
      if (this.parameterPresent('_id=')) {
        let start = this.todoUrl.indexOf('_id=');
        const end = this.todoUrl.indexOf('&', start);
        if (this.todoUrl.substring(start - 1, start) === '?') {
          start = start - 1;
        }
        this.todoUrl = this.todoUrl.substring(0, start) + this.todoUrl.substring(end + 1);
      }
    }
  }

  private parameterPresent(searchParam: string) {
    return this.todoUrl.indexOf(searchParam) !== -1;
  }

  //remove the parameter and, if present, the &
  private removeParameter(searchParam: string) {
    let start = this.todoUrl.indexOf(searchParam);
    let end = 0;
    if (this.todoUrl.indexOf('&') !== -1) {
      end = this.todoUrl.indexOf('&', start) + 1;
    } else {
      end = this.todoUrl.indexOf('&', start);
    }
    this.todoUrl = this.todoUrl.substring(0, start) + this.todoUrl.substring(end);
  }

  addNewTodo(newTodo: Todo): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        // We're sending JSON
        'Content-Type': 'application/json'
      }),
      // But we're getting a simple (text) string in response
      // The server sends the hex version of the new todo back
      // so we know how to find/access that todo again later.
      responseType: 'text' as 'json'
    };

    // Send post request to add a new todo with the todo data as the body with specified headers.
    return this.http.post<string>(this.todoUrl + '/new', newTodo, httpOptions);
  }
}

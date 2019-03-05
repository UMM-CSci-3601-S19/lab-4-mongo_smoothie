import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Todo} from './todo';
import {FormControl, Validators, FormGroup, FormBuilder} from "@angular/forms";
import {BodyValidator} from "./body.validator";

@Component({
  selector: 'add-todo.component',
  templateUrl: 'add-todo.component.html',
})

export class AddTodoComponent implements OnInit {

  addTodoForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { todo: Todo }, private fb: FormBuilder) {
  }
  // not sure if this body is magical and making it be found or if I'm missing something,
  // but this is where the red text that shows up (when there is invalid input) comes from
  add_todo_validation_messages = {
    'body': [
      {type: 'required', message: 'Body is required'},
      {type: 'minlength', message: 'Body must be at least 2 characters long'},
      {type: 'maxlength', message: 'Body cannot be more than 25 characters long'},
      {type: 'pattern', message: 'Body must contain only numbers and letters'}
    ],

    'owner': [
      {type: 'required', message: 'Owner is required'},
      {type: 'minlength', message: 'Owner must be at least 2 characters long'},
      {type: 'maxlength', message: 'Owner cannot be more than 25 characters long'},
      {type: 'pattern', message: 'Owner must contain only numbers and letters'}
      ],

    'category': [
      {type: 'required', message: 'Category is required'},
      {type: 'minlength', message: 'Category must be at least 2 characters long'},
      {type: 'maxlength', message: 'Category cannot be more than 25 characters long'},
      {type: 'pattern', message: 'Category must contain only numbers and letters'}
    ],

    'status': [
      {type: 'required', message: 'Status is required'},
      {type: 'minlength', message: 'Status must be at least 2 characters long'},
      {type: 'maxlength', message: 'Status cannot be more than 25 characters long'},
      {type: 'pattern', message: 'Status must contain only numbers and letters'}
    ],

    '_id': [
      {type: 'required', message: 'ID is required'},
      {type: 'minlength', message: 'ID must be at least 2 characters long'},
      {type: 'maxlength', message: 'ID cannot be more than 25 characters long'},
      {type: 'pattern', message: 'ID must contain only numbers and letters'}
    ]
  };

  createForms() {

    // add todo form validations
    this.addTodoForm = this.fb.group({
      // We allow alphanumeric input and limit the length for body.
      body: new FormControl('body', Validators.compose([
        BodyValidator.validBody,
        Validators.minLength(2),
        Validators.maxLength(25),
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?'),
        Validators.required
      ]))

    })

  }

  ngOnInit() {
    this.createForms();
  }

}

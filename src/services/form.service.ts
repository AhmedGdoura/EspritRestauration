import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class FormService {
  constructor() {}

  createMessageForm(): FormGroup {
    return new FormBuilder().group({
      message: ['', Validators.compose([Validators.required])],
    });
  }
}

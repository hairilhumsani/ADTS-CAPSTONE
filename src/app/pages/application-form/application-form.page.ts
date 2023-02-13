import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.page.html',
  styleUrls: ['./application-form.page.scss'],
})
export class ApplicationFormPage implements OnInit {
  applicationForm: FormGroup;

  constructor() { 
    this.applicationForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      contactNumber: new FormControl('', [Validators.required, Validators.pattern('^((\\+65?)|0)?[0-9]{8}$'), Validators.minLength(8), Validators.maxLength(8)]),
      certification: new FormControl('', [Validators.required]),
      gpa: new FormControl('', [Validators.required]),
      industry: new FormControl('', [Validators.required]),
      summary: new FormControl('', [Validators.required]),
      salary: new FormControl('', [Validators.required]),
      birth: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
  }

}

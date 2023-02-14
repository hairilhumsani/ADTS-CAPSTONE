import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.page.html',
  styleUrls: ['./update-profile.page.scss'],
})
export class UpdateProfilePage implements OnInit {

  account : string = '';

  accountData : any = [];

  updateForm: FormGroup;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE'
    })
  };

  constructor(private route : ActivatedRoute, private router : Router,private http: HttpClient, private toast : ToastController) { 

    this.updateForm = new FormGroup({
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
    this.route.params.subscribe((params:Params) => this.account = params['type'])
    this.route.params.subscribe((params:Params) => this.getProfileDetailStudent(params['accountId']))
  }

  getProfileDetailStudent(id:any)
  {

    var url = "https://broappv6.herokuapp.com/getStudentId/" + id

    this.http.get(url, this.httpOptions).subscribe((data) => {
      var tempData:any = data;
      this.accountData = tempData[0];
      console.log(this.accountData)
    })
  }

  updateProfile()
  {
    var url = 'https://broappv6.herokuapp.com/updateStudent'

    var postData = JSON.stringify({
      studentId : this.updateForm.value['studentId'],
      name : this.updateForm.value['name'],
      contact_no : this.updateForm.value['contact_no'],
      email : this.updateForm.value['email'],
      certification : this.updateForm.value['certification'],
      gpa : this.updateForm.value['gpa'],
      industry_interest : this.updateForm.value['industry'],
      summary : this.updateForm.value['summary'],
      expected_salary : this.updateForm.value['expected_salary'],
      birth_date : this.updateForm.value['birth_date'],
      gender : this.updateForm.value['gender'],
      password : this.updateForm.value['password'],

    })


      this.http.put(url, postData, this.httpOptions).subscribe(data => {
        if (data == false) {
          this.addedFail("Could not update student details.")
        }
        else if (data == true) {
          this.added("Student details updated.")
        }
      })
  }

  async added(message: string) {

    let toast = await this.toast.create({
      message: message,
      duration: 3000,
      position: 'top'
    });

    window.location.reload();

    return await toast.present();
  }

  async addedFail(message: string) {

    let toast = await this.toast.create({
      message: message,
      duration: 4000,
      position: 'top'
    });

    return await toast.present();
  }

}

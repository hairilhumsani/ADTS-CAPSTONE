import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  account : string = '';

  signupFormCompany: FormGroup;

  signupFormStudent: FormGroup;

  constructor(private route : ActivatedRoute, private router : Router,
    private modalController: ModalController,
    public toast: ToastController, 
     public http: HttpClient, 
     public formBuilder: FormBuilder) {

      this.signupFormCompany = new FormGroup({

        companyName: new FormControl('', [Validators.required]),
        companyEmail: new FormControl('', [Validators.required, Validators.email]),
        companyAddress: new FormControl('', [Validators.required]),
        companyDescription: new FormControl('', [Validators.required]),
        typeOfIndustry: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required])


      });

      this.signupFormStudent = new FormGroup(
        {
          studentName : new FormControl('', [Validators.required]),
          studentEmail : new FormControl('', [Validators.required, Validators.email]),
          studentGender : new FormControl('', [Validators.required]),
          studentPassword : new FormControl('', [Validators.required])
        }
      )
      }

  ngOnInit() {

    this.route.params.subscribe((params:Params) => this.account = params['type'])

  }

  backToLogin()
  {
    this.router.navigate([''])
  }

  signupCompany() {
    var url = 'https://broappv6.herokuapp.com/signupCompany';

       var postData = JSON.stringify({
        CompanyName: this.signupFormCompany.value['companyName'],
        CompanyEmail: this.signupFormCompany.value['companyEmail'],
        CompanyAddress: this.signupFormCompany.value['companyAddress'],
        CompanyDescription: this.signupFormCompany.value['companyDescription'],
        TypeOfIndustry: this.signupFormCompany.value['typeOfIndustry'],
        Password: this.signupFormCompany.value['password'],
       });
       const httpOptions = {
         headers: new HttpHeaders({
           'Content-Type': 'application/json',
           'Access-Control-Allow-Origin': '*',
           'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE'
         })
       };
       this.http.post(url, postData, httpOptions).subscribe((data) => {
         if (data == false) {
           this.registerfail()
         } else if (data == true) {
           this.register(this.signupFormCompany.value['companyEmail']);
           this.backToLogin();
         }
       }, error => {
         console.log(error);
       });
 
 
   }


   signupStudent() {
    var url = 'https://broappv6.herokuapp.com/signupStudent';

       var postData = JSON.stringify({
        Email: this.signupFormStudent.value['studentEmail'],
        Name: this.signupFormStudent.value['studentName'],
        Password: this.signupFormStudent.value['studentPassword'],
        Gender: this.signupFormStudent.value['studentGender'],
       });
       const httpOptions = {
         headers: new HttpHeaders({
           'Content-Type': 'application/json',
           'Access-Control-Allow-Origin': '*',
           'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE'
         })
       };
       this.http.post(url, postData, httpOptions).subscribe((data) => {
         if (data == false) {
           this.registerfail()
         } else if (data == true) {
           this.register(this.signupFormStudent.value['studentEmail']);
           this.backToLogin();
         }
       }, error => {
         console.log(error);
       });
 
 
   }

   async register(email : string) {
    
    let toast = await this.toast.create({
      message: 'Account created for ' + email,
      duration: 3000,
      position: 'top'
    });
    
    return await toast.present();
  }

  async registerfail() {
    var email = this.signupFormCompany.value['companyEmail'];

    let toast = await this.toast.create({
      message: 'Error! ' + email + ' existed',
      duration: 4000,
      position: 'top'
    });

    return await toast.present();
  }

}

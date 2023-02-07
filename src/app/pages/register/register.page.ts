import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  signupForm: FormGroup;
  //data: Observable<any>;

  constructor(private route : ActivatedRoute, private router : Router,
    private modalController: ModalController,
    public toast: ToastController, 
     public http: HttpClient, 
     public formBuilder: FormBuilder) {

      this.signupForm = new FormGroup({});
      }

  ngOnInit() {

    this.route.params.subscribe((params:Params) => this.account = params['type'])

  }

  backToLogin()
  {
    this.router.navigate([''])
  }

  signupCompany() {
    //this.modalController.dismiss();
    var url = 'https://itj153-21s1.herokuapp.com/signup';
    //var url = 'https://itj153-21s1.herokuapp.com/signupNoHash';  //No encryption - password in the clear
       var postData = JSON.stringify({
 // saving it as Email and will be used at server.js
         Email: this.signupForm.value['email'], 
         Password: this.signupForm.value['password'],
       });
       const httpOptions = {
         headers: new HttpHeaders({
           'Content-Type': 'application/json',
           'Access-Control-Allow-Origin': '*',
           'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE'
         })
       };
       this.http.post(url, postData, httpOptions).subscribe((data) => {
         console.log('postData:', postData)
         if (data == false) {
           this.registerfail()
         } else if (data == true) {
           this.register()     
            this.modalController.dismiss();
         }
       }, error => {
         console.log(error);
       });
 
 
   }

   async register() {
    
    var email = this.signupForm.value['email'];

    let toast = await this.toast.create({
      message: 'Account created for ' + email,
      duration: 3000,
      position: 'top'
    });
    
    return await toast.present();
  }

  async registerfail() {
    var email = this.signupForm.value['email'];

    let toast = await this.toast.create({
      message: 'Error! ' + email + ' existed',
      duration: 4000,
      position: 'top'
    });

    return await toast.present();
  }

}

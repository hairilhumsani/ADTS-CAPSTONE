import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {LoadingController, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginCompanyForm: FormGroup;
  loginStudentForm: FormGroup;

  account : string = "students";

  constructor(private router : Router,
    private toast:ToastController,
    public http:HttpClient,
    private storage: Storage,
    private loadingCtrl: LoadingController) {

    this.loginCompanyForm = new FormGroup({
      
      companyEmail: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])

    })

    this.loginStudentForm = new FormGroup({
      studentEmail: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })

   }

  ngOnInit() {
  }


  goToRegister(typeOfRegister : string)
  {

    this.router.navigate(['register',typeOfRegister]); //once added relocate to tab2

  }


  loginCompany(){
    var url = 'https://broappv6.herokuapp.com/loginCompany';
  
    var email = this.loginCompanyForm.value['companyEmail']
    var password = this.loginCompanyForm.value['password']
 
    var postData = JSON.stringify({
      CompanyEmail: email,
      Password: password,
    });
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE'
      })
    };
  
    this.http.post(url, postData, httpOptions).subscribe((data) => {
      if (data != null) {
        console.log("Login Successful") 
        this.setAccount("company")
        this.setEmail(email)//session
        this.storage.set("accountData",data)
        this.setLoading('home')
      } else {
          this.loginFail();
       
      }
     }, error => {
      this.loginFail();
        // console.log(error);
    });
  
  
  }

  loginStudent(){
    var url = 'https://broappv6.herokuapp.com/loginStudent';
  
    var email = this.loginStudentForm.value['studentEmail']
    var password = this.loginStudentForm.value['password']
 
    var postData = JSON.stringify({
      StudentEmail: email,
      Password: password,
    });
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE'
      })
    };
  
    this.http.post(url, postData, httpOptions).subscribe((data) => {
      if (data != null) {
        console.log("Login Successful") 
        this.setAccount("student")
        this.setEmail(email)//session
        this.storage.set("accountData",data)
        this.setLoading('student')
        
      } else {
          this.loginFail();
       
      }
     }, error => {
      this.loginFail();
        // console.log(error);
    });
  
  
  }

  async setAccount(account : string)
  {
    await this.storage.set("account",account);
  }

  async setEmail(email : string) {

     this.storage.set('email',email)
     
    let toast = await this.toast.create({
      message: 'Login passed ' ,
      duration: 5000,
      position: 'top'
    });
    return await toast.present();
  
  }
  
  async loginFail() {
  
    let toast = await this.toast.create({
      message: 'Error! Login failed ' ,
      duration: 3000,
      position: 'top'
    });
    return await toast.present();
  
  }

 async setLoading(accountType : string)
  {
   
    (await this.loadingCtrl.create({
      message: 'Login In',
      duration: 3000,
    })).present().then(() =>
    {
      this.router.navigate([accountType]);
    }).finally(()=>{
      window.location.reload();
    });
  }

}

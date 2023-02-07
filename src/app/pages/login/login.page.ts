import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private typeLogin : boolean = false;

  account : string = "students";

  constructor(private storage : Storage,private router : Router) { }

  ngOnInit() {
  
  }


  goToRegister(typeOfRegister : string)
  {

    this.router.navigate(['register',typeOfRegister]); //once added relocate to tab2

  }


}

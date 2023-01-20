import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private typeLogin : boolean = false;

  constructor(private storage : Storage) { }

  ngOnInit() {
    this.setSTUFF();
  
  }

   setEmail()
  {
    this.storage.get('Name').then(data=>{console.log(data)})
  }


  async setSTUFF()
  {
    await this.storage.set('Name','BABAI TEST');
  }


}

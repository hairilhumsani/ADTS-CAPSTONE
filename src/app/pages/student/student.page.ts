import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastController, ModalController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-student',
  templateUrl: './student.page.html',
  styleUrls: ['./student.page.scss'],
})
export class StudentPage implements OnInit {


  eventChange: any = "";

  emailAccount: string = "";
  typeOfAccount: string = "";
  accountData: any = [];
  companyData: any = [];

  openHouseList: any = [];
  openHouseData: any =[];
  openHouseDateTime: any = "";
  openHouseAddForm: FormGroup;

  jobList: any = [];
  jobListArray: any = [];
  jobDetailsAddForm: FormGroup;

  applicationCompanyList: any = [];
  applicationCompanyForm: FormGroup;

  jobSelectedValueCompanyApplication: any = []



  applicationStudentForm: FormGroup;


  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE'
    })
  };

  constructor(private storage: Storage, private http: HttpClient, private toast: ToastController, private modalController: ModalController, private router: Router, private loadingCtrl: LoadingController) {

    this.openHouseAddForm = new FormGroup({
      location: new FormControl('', [Validators.required]),
      dateTime: new FormControl('', [Validators.required]),
      noOfPax: new FormControl('', [Validators.required])

    })

    this.jobDetailsAddForm = new FormGroup({
      jobName: new FormControl('', [Validators.required]),
      jobDescription: new FormControl('', [Validators.required]),
      jobRequirement: new FormControl('', [Validators.required])
    })

    this.applicationCompanyForm = new FormGroup({
      description: new FormControl('', [Validators.required]),
      jobType: new FormControl('', [Validators.required]),
      jobsId: new FormControl('', [Validators.required]),
      openHouseId: new FormControl('', [Validators.required])

    })

    this.applicationStudentForm = new FormGroup(
      {

      }
    )

    

  }

  async ngOnInit() {
    await this.storage.get('accountData').then(v => this.accountData = v);

    this.setEmail();
    this.getAllOpenHouseItems();
    this.getAllApplicationCompanyItems();
  }

  async setEmail() {

    this.emailAccount = this.accountData[0].name;
  }

  updateModalPage(event: any) {
    this.eventChange = event.detail.value;
    this.openHouseData.company.company_name = "";
  }

  getCompanyById(id :any)
  {
    var url = 'https://broappv6.herokuapp.com/company/' + id

    this.http.get(url, this.httpOptions).subscribe((data) => {

      var tempData : any = data
      this.companyData = tempData[0]

      })

      console.log(this.openHouseData);
  }

  getAllOpenHouseItems() {
    var url = "https://broappv6.herokuapp.com/getAllOpenHouse"

    this.http.get(url, this.httpOptions).subscribe((data) => {
      this.openHouseList = data;

      for (let i = 0; i < this.openHouseList.length; i++) {
        var date = moment(this.openHouseList[i].datetime).utcOffset(0)
        this.openHouseList[i].datetime = date.format("YYYY/MM/DD HH:mm");
        console.log(this.openHouseList);
      }
    })
    
  }


  getOpenHouseItems(id: any) {
    var url = "https://broappv6.herokuapp.com/getOpenHouseByCompanyId/" + id

    this.http.get(url, this.httpOptions).subscribe((data) => {
      this.openHouseList = data;

      for (let i = 0; i < this.openHouseList.length; i++) {
        var date = moment(this.openHouseList[i].datetime).utcOffset(0)
        this.openHouseList[i].datetime = date.format("YYYY/MM/DD HH:mm");
      }
    })

  }


  getOpenHouseItemById(id: any) {
    var url = "https://broappv6.herokuapp.com/getOpenHouseByOpenHouseId/" + id.detail.value

    this.http.get(url, this.httpOptions).subscribe((data) => {
      var tempData: any = data;
      this.openHouseData = tempData[0];
      var date = moment(this.openHouseData.datetime).utcOffset(0);
      this.openHouseData.datetime = date.format("YYYY/MM/DD HH:mm");
  
      this.openHouseData.company = this.getCompanyById(this.openHouseData.companyId);
     

    })

    console.log(this.openHouseData)

  }


  async getJobDetailsItems(id: any) {
    var url = "https://broappv6.herokuapp.com/getJobDetailsById/" + id

    this.http.get(url, this.httpOptions).subscribe((data) => {
      this.jobList = data;
    })

  }

  async getJobDetailsItemsByJobId(id: any) {
    var url = "https://broappv6.herokuapp.com/getJobDetailsByJobId/" + id

    this.http.get(url, this.httpOptions).subscribe((data) => {
      this.jobList = data;
    })

  }
  getApplicationCompanyItems(id: any) {
    var url = "https://broappv6.herokuapp.com/getApplicationCompany/" + id
    this.http.get(url, this.httpOptions).subscribe((data) => { this.applicationCompanyList = data }
    )
  }

  getAllApplicationCompanyItems() {
    var url = "https://broappv6.herokuapp.com/getApplicationCompany/"
    this.http.get(url, this.httpOptions).subscribe((data) => {
      this.applicationCompanyList = data;
    })


  }

  gotoUpdateProfile(typeOfRegister: string) {

    this.router.navigate(['update-profile', typeOfRegister, this.accountData[0].studentId]);

  }
  formatDateTimeValue() {

    const formattedString = moment(this.openHouseDateTime).format("YYYY/MM/DD hh:mm")
    this.openHouseDateTime = formattedString;
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

  async logout() {

    let loading = await this.loadingCtrl.create({
      message: "Logging out",
      duration: 1000
    })

    loading.present().finally(async () => {

      let toast = await this.toast.create({
        message: "Logout successfuly",
        duration: 1000,
        position: 'top'
      })

      this.storage.set("reloadFirst", true)

      return await toast.present().finally(async () => {
        this.router.navigate([""])
      })

    })

  }

}

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

  

  
  emailAccount: string = "";
  typeOfAccount: string = "";
  accountData: any = [];

  openHouseList: any = [];
  openHouseDateTime: any = "";
  openHouseAddForm: FormGroup;

  jobList: any = [];
  jobListArray : any = [];
  jobDetailsAddForm: FormGroup;

  applicationCompanyList: any = [];
  applicationCompanyForm: FormGroup;

  jobSelectedValueCompanyApplication: any = []



  applicationStudentForm : FormGroup;


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
      description : new FormControl('', [Validators.required]),
      jobType : new FormControl('', [Validators.required]),
      jobsId : new FormControl('', [Validators.required]),
      openHouseId : new FormControl('', [Validators.required])

    })

    this.applicationStudentForm =  new FormGroup(
      {
        
      }
    )

  }

  async ngOnInit() {

    await this.storage.get('account').then(v => this.typeOfAccount = v);
    await this.storage.get('accountData').then(v => this.accountData = v);

    this.setEmail();

    if (this.typeOfAccount == "company") {
      this.getOpenHouseItems(this.accountData[0].companyId)
      this.getJobDetailsItems(this.accountData[0].companyId)
      this.getApplicationCompanyItems(this.accountData[0].companyId)
    }
    else if (this.typeOfAccount == 'student')
    {
      this.getAllApplicationCompanyItems();
    }

  }

  async setEmail() {
    console.log(this.accountData)
    console.log(this.typeOfAccount)
    if (this.typeOfAccount == "company") {
      this.emailAccount = this.accountData[0].company_name;
    }
    else if (this.typeOfAccount == "student") {
      this.emailAccount = this.accountData[0].name;
    }
  }


  getOpenHouseItems(id: any) {
    var url = "https://broappv6.herokuapp.com/getOpenHouseByCompanyId/" + id

    this.http.get(url, this.httpOptions).subscribe((data) => {
      this.openHouseList = data;

      for (let i = 0; i < this.openHouseList.length; i++)
      {
        var date =  moment(this.openHouseList[i].datetime).utcOffset(0)
        this.openHouseList[i].datetime = date.format("YYYY/MM/DD HH:mm");
      }
    })

  }


   getOpenHouseItemById(id: any) {
    var url = "https://broappv6.herokuapp.com/getOpenHouseByOpenHouseId/" + id

    this.http.get(url, this.httpOptions).subscribe((data) => {
      var tempData : any = [];
      tempData = data;
      this.openHouseList = tempData[0];
      var date = moment(this.openHouseList.datetime).utcOffset(0);
      this.openHouseList.datetime = date.format("YYYY/MM/DD HH:mm");

    })

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
  getApplicationCompanyItems(id:any)
  {
    var url = "https://broappv6.herokuapp.com/getApplicationCompany/" + id
    this.http.get(url,this.httpOptions).subscribe((data) =>
    {this.applicationCompanyList = data}
    )
  }

  getAllApplicationCompanyItems()
  {
    var url = "https://broappv6.herokuapp.com/getApplicationCompany/"
    this.http.get(url,this.httpOptions).subscribe((data)=>
    {
      this.applicationCompanyList = data;
      console.log(data);
    })

    
  }

  getAppCom(appCompanyId : any)
  {
    var url = "https://broappv6.herokuapp.com/getJobOpenHouse/" + appCompanyId.detail.value; 
    this.http.get(url,this.httpOptions).subscribe((data)=>
    {

      let tempData: any = data;
      this.jobSelectedValueCompanyApplication = tempData[0];
      console.log(data)
    }
    )
  }

  saveOpenHouseDetails() {

    var url = "https://broappv6.herokuapp.com/addOpenHouseDetails/"

    var postData = JSON.stringify({
      Location: this.openHouseAddForm.value['location'],
      DateTime: this.openHouseAddForm.value['dateTime'],
      NoOfPax: this.openHouseAddForm.value['noOfPax'],
      CompanyId: this.accountData[0].companyId
    });

    this.http.post(url, postData, this.httpOptions).subscribe(data => {
      if (data == false) {
        this.addedFail("Could not add open house details.")
      } else if (data == true) {
        this.added("Open house details added");
        this.modalController.dismiss("open-modal")
      }
    })

  }

  saveJobDetails() {
    var url = "https://broappv6.herokuapp.com/addJobDetails"

    var postData = JSON.stringify({
      JobName: this.jobDetailsAddForm.value['jobName'],
      JobDetails: this.jobDetailsAddForm.value['jobDescription'],
      Requirements: this.jobDetailsAddForm.value['jobRequirement'],
      CompanyId: this.accountData[0].companyId
    })

    this.http.post(url, postData, this.httpOptions).subscribe(data => {
      if (data == false) {
        this.addedFail("Could not add job details.")
      }
      else if (data == true) {
        this.added("Job details added.")
      }
    })
  }


  saveApplicationCompany()
  {
    var url = "https://broappv6.herokuapp.com/addApplicantCompany"

    var postData = JSON.stringify({
      JobsIds : this.applicationCompanyForm.value['jobsId'].toString(),
      OpenHouseId : this.applicationCompanyForm.value['openHouseId'],
      Availability : "Yes",
      NoOfApplicant : 0,
      Description : this.applicationCompanyForm.value['description'],
      JobType : this.applicationCompanyForm.value['jobType'],
      CompanyId : this.accountData[0].companyId
 
    })

    console.log(postData)

    this.http.post(url, postData, this.httpOptions).subscribe(data => {
      if (data == false) {
        this.addedFail("Could not add application details.")
      }
      else if (data == true) {
        this.added("Application details added.")
      }
    })
  }

  updateApplicationCompany(item : any)
  {
    var url = "https://broappv6.herokuapp.com/updateApplicantCompany"

    var postData = JSON.stringify({
      ApplicationCompanyId : item.appCompanyId,
      JobsIds : this.applicationCompanyForm.value['jobsId'].toString(),
      OpenHouseId : this.applicationCompanyForm.value['openHouseId'],
      Availability : item.availability,
      NoOfApplicant : item.noOfApplicant,
      Description : this.applicationCompanyForm.value['description'],
      JobType : this.applicationCompanyForm.value['jobType'],
      CompanyId : item.companyId
 
    })

    this.http.put(url, postData, this.httpOptions).subscribe(data => {
      if (data == false) {
        this.addedFail("Could not update application details.")
      }
      else if (data == true) {
        this.added("Application details updated.")
      }
    })
  }

  deleteApplicationCompany(id:any)
  {
    var url ='https://broappv6.herokuapp.com/deleteApplicationCompany/' + id
    this.http.delete(url,this.httpOptions).subscribe(data =>
      {
        if (data == false) {
          this.addedFail("Could not delete application.")
        }
        else if (data == true) {
          this.added("Application details delete.")
        }
      })
  }


  getCompanyApplicationDefaultValues(item:any)
  {
    this.jobSelectedValueCompanyApplication = item
    this.jobSelectedValueCompanyApplication.jobIds = item.jobIds.toString().split(',');
    this.jobSelectedValueCompanyApplication.openHouseId = item.openHouseId.toString();
  }

   async getApplicationDefaultValues(item:any)
  {
    
    this.jobSelectedValueCompanyApplication = this.applicationCompanyList[item.detail.value]
    this.jobSelectedValueCompanyApplication.jobIds = this.applicationCompanyList[item.detail.value].jobIds.toString().split(',');

    this.getOpenHouseItemById(this.jobSelectedValueCompanyApplication.openHouseId)


    for (item of this.jobSelectedValueCompanyApplication.jobIds)
    {
      this.getJobDetailsItemsByJobId(item)
      await this.delay(5000)
      this.jobListArray.push(this.jobList[0])
      console.log(this.jobListArray)
    }
    await this.delay(8000)
    
  }


  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
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

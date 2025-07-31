import { Component, OnInit, ViewChild } from '@angular/core';
// import { AgmMap, MapsAPILoader } from '@agm/core';
import { AttendanceService } from 'src/app/_services/attendance.service';
import { MenuItem, MessageService } from 'primeng/api';
import { NewLeaveDataModel } from 'src/app/_models/newleavedata.model';
import { NewAttendanceModel, CoordinatesModel } from 'src/app/_models/newAttendance.model';
import { ProjectService } from 'src/app/_services/project.service';
import { Selectitem } from 'src/app/_models/selectItem.model';
import { ProjectModel } from 'src/app/_models/projects.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConnectionService } from 'projects/connection-service/src/lib/connection-service.service';
import { Router } from '@angular/router';





@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})

export class AttendanceComponent implements OnInit {
  //12222020
  attendanceForm: FormGroup;
  display:boolean=true;
  submitted = false;

  //-------------------


  // @ViewChild(AgmMap, { static: true }) public agmMap: AgmMap;

  uploadedFiles: File = null;




  title: string;

  inBreak: boolean;
  inBreakEnd: boolean;
  CheckInVisisble: boolean = true;
  userLocation: string;
  checkinlocation: string;
  checkintime: Date;
  checkproject: string;
  Todaydate: string;
  currentime: Date;
  comment: string;

  date: string;
  date1: string;
  testd:string;
  NewAttendance: NewAttendanceModel;
  NewCoordinates: CoordinatesModel;

  projeactdata: ProjectModel[];
  projectList: Selectitem[] = [];
  itemss: Selectitem[];
  selectedProject: Selectitem;
  status: boolean = false;


  constructor(
    //private apiloader: MapsAPILoader,
     private AttendService: AttendanceService,
    private projectservice: ProjectService,
    private formBuilder: FormBuilder,
    private connectionService: ConnectionService,
    private router: Router,
    private messageService: MessageService) {

    // this.connectionService.monitor().subscribe(currentState => {
    //   this.hasNetworkConnection = currentState.hasNetworkConnection;
    //   this.hasInternetAccess = currentState.hasInternetAccess;
    //   if (this.hasNetworkConnection && this.hasInternetAccess) {
    //     this.status = false;

    //   } else {
    //    this.status = true;

    //   }
    // });


  }

  // itemss: Array<any> = [{ name: 'L1', id: 1 }, { name: 'L2', id: 2 }, { name: 'L3', id: 3 }, { name: 'L4', id: 4 }]






  ngOnInit(): void {
    this.process = false;

    this.attendanceForm = this.formBuilder.group({
      empId: [''],
      remarks: [''],
      punchMode: [''],
      imageFile: [''],
      latitude: [''],
      longitude: [''],
      projectID: ['', Validators.required],
      locationName: [''],
      punchdate: ['']
    });

    this.attendanceForm.reset();
    this.title = ""
    this.itemss = [];
    //project list 
    this.projectservice.GetProjects().subscribe(projects => {
      this.projeactdata = projects
      for (let i = 0; i < this.projeactdata.length; i++) {
        this.itemss.push({ label: this.projeactdata[i].projectName, value: this.projeactdata[i].projectId });
      }
    });
    //attendance  Time  

    setInterval(() => {
      this.AttendService.GetTime().subscribe(x => {
        this.currentime = new Date(x.curtime);
        this.date = this.currentime.toLocaleTimeString();
        this.date1 = new Date().toUTCString();
        // console.log(this.date1,'Hai Testing')
      });
    }, 1000);

    this.NewCoordinates = {};
    this.NewAttendance = {};
    this.comment = "";
    this.checkinlocation = "";
    this.checkintime = null;
    //this.currentime= "";
    this.get()
    // this.agmMap.triggerResize(true);
    this.zoom = 16;
    this.updateStatus();

  }

  get f() { return this.attendanceForm.controls; }

  onFileSelect(event) {


    if (event.target.files.length > 0) {
      this.uploadedFiles = event.target.files[0];
      console.log(this.uploadedFiles);
      // const file = event.target.files;
      //  this.attendanceForm.get('imageFile').setValue(file);
    }
  }

  onSubmit() {
    this.submitted = true;
    const formData = new FormData();
    formData.append('file', this.attendanceForm.get('imageFile').value);
    formData.append('file1', "sdfsf");

    console.dir(formData);

  }

  zoom: number;
  lat: any;
  lng: any;
  getAddress: any;


  items: MenuItem[];

  get() {

    if (navigator.geolocation) {


      navigator.geolocation.getCurrentPosition((position: any) => {


        if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.getAddress = (this.lat, this.lng)
          //  console.log(position)
          //  alert( this.lat+"-"+this.lng);

          // this.apiloader.load().then(() => {
          //   let geocoder = new google.maps.Geocoder;
          //   let latlng = { lat: this.lat, lng: this.lng };

          //   geocoder.geocode({ 'location': latlng }, function (results, status) {
          //     //  alert(status);
          //     console.log(results);
          //     if (results[0]) {
          //       this.currentLocation = results[0].formatted_address;

          //       console.log(this.currentLocation);

          //       console.log(this.assgin);
          //     } else {
          //       console.log('Not found');
          //     }
          //   });
          //   //  this.userLocation = "" // locatio[n not abvailable in demo 

          // });

        }
      },err=>
      {
        // alert("Please Allow location service ");
        // this.router.navigate(['/user/dashboard']);
      }
      )
    }
   
  }

  

  close(){
    this.router.navigate(['/user/dashboard']);

  }

  process: boolean = false;
  /** checkin  */
  docheckin(atformdata: FormGroup) {
    this.process = true;
    console.log(this.process);
    //if(this.process != 1) return false;

    this.submitted = true;
    if (!this.attendanceForm.valid) {
      this.process = false;
      return false;
    }

    let formData = new FormData();

    // console.log(new Date(this.date), 'date check 1');

    formData.append('projectID', this.attendanceForm.get('projectID').value);
    formData.append('latitude', this.lat);
    formData.append('longitude', this.lng);
    formData.append('file', this.uploadedFiles);
    formData.append('remarks', this.attendanceForm.get('remarks').value);
    formData.append('punchMode', "true");
    formData.append('punchdate',this.date1);      ///---- change if not required
    console.log(formData,'testitem1');
    this.AttendService.DochekIN2(formData).subscribe(res => {
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Your successfully check in..' });

      this.updateStatus();
      this.process = false;
      this.attendanceForm.reset();
      setTimeout(() => {
        this.router.navigateByUrl('user/dashboard');
      }, 1000)
    }, er => {
      this.process = false;

      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Network Error.. Try agian' });
    })
  }
  /** checkout  */
  docheckout() {
    this.process = true;

    this.submitted = true;
    this.attendanceForm.controls['projectID'].setValue(this.currentstatusData["project"]["projectId"]);
    console.log(this.currentstatusData);
    if (!this.attendanceForm.valid) {
      this.process = false;
      return false;
    }
    let formData = new FormData();

    // console.log(this.date, 'date check 2');

    formData.append('projectID', this.currentstatusData["project"]["projectId"]);
    formData.append('latitude', this.lat);
    formData.append('longitude', this.lng);
    formData.append('file', this.uploadedFiles);
    formData.append('remarks', this.attendanceForm.get('remarks').value);
    formData.append('punchMode', "false");
    formData.append('punchdate',this.date1);      ///---- change if not required

    // console.log(formData,'testitem2');
    this.AttendService.DochekIN2(formData).subscribe(res => {
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Your successfully check Out..' });

      this.updateStatus();
      this.process = false;

      this.attendanceForm.reset();
      setTimeout(() => {
        this.router.navigateByUrl('user/dashboard');
      }, 1000)

    }, er => {
      this.process = false;

      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Network Error.. Try agian' });
    })
  }


  currentstatusData: any;
  updateStatus() {

    this.AttendService.GetStatus().subscribe(res => {
      this.currentstatusData = res;
      if (res.punchMode == null || res.punchMode == false) {
        this.title = "You'r Not in Office";
        this.CheckInVisisble = true;
        this.attendanceForm = this.formBuilder.group({
          empId: [''],
          remarks: [''],
          punchMode: [''],
          imageFile: [''],
          latitude: [''],
          longitude: [''],
          projectID: ['', Validators.required],
          locationName: [''],
          punchdate:['']
        });
      } else {
        this.title = "You'r in Office";
        this.CheckInVisisble = false;
        this.attendanceForm = this.formBuilder.group({
          empId: [''],
          remarks: [''],
          punchMode: [''],
          imageFile: [''],
          latitude: [''],
          longitude: [''],
          projectID: [''],
          locationName: [''],
          punchdate:['']
        });

      }

      this.checkinlocation = res.locationName;
      debugger;
      console.log( new Date(res.punchDate+ 'Z'),'1111');
      this.checkintime =new Date(res.punchDate + 'Z' );
     
      console.log(this.checkintime,'tttt');
       this.testd= new Date(res.punchDate).toString();
       console.log(this.testd,'time zone');
      this.checkproject = res["project"]["projectName"];
      //this.checkinProject =res;

    })

  }

}

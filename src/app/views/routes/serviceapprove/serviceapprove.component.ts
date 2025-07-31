import { Component, OnInit } from '@angular/core';
import { LeaveDataService } from 'src/app/_services/leaveData.service';
import { AuthenticationService } from 'src/app/_services';
import { User } from 'src/app/_models/user';
import { ViewLeaveDataModel } from 'src/app/_models/viewLeavData.model';
import { ServiceReqService } from 'src/app/_services/serviceReq.service';
import { ViewServiceRequestModel } from 'src/app/_models/viewserviceReq.model';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ServiceTypeReqModel } from 'src/app/_models/serviceTypeReq.model';

@Component({
  selector: 'app-serviceapprove',
  templateUrl: './serviceapprove.component.html',
  styleUrls: ['./serviceapprove.component.scss']
})

export class ServiceapproveComponent implements OnInit {
  filtercompany:any
  serviceTypee:any;
  display: boolean = false;
  currentUserData:User;
  ServiceDatas: Array<ViewServiceRequestModel>;
  fromdate: Date;
  enddate: Date;
  ServiceType: Array<ServiceTypeReqModel>;
  
  empName: any=null;
  /** Handsontable  */
  tableSettings: any = {
    viewportColumnRenderingOffset: 27,
    viewportRowRenderingOffset: "auto",
    height: 450,
    stretchH: "all",
    maxRows: 22,
    manualRowResize: false,
    manualColumnResize: false,
    autoWrapRow: true,
    minSpareRows: false,
    columnSorting: true,
    fillHandle: false,
    licenseKey: 'non-commercial-and-evaluation',
     columns: [
        {
          data: 'serviceReqId',
          type: 'numeric',
          width: 40,
          readOnly: true

        },
        {
          data: 'serviceReqTypeNavigation.serviceReqTypeName',
          type: 'text',
          readOnly: true
                },
                {
                  data: 'serviceReqDate',
                  type: 'text',
                  readOnly: true,
                //  dateFormat: 'MM/DD/YYYY'
                },
               
        
        {
          data: 'leaveDataReason',
          readOnly: true,
          type: 'text',
        
        },
       
        {
          readOnly: true,
          data: 'serviceReqStatus',
        renderer: (instance, TD, row, col, prop, value, cellProperties) => {
            console.log(value);
            if(value ==0)          TD.innerHTML = `Pending  <button class="delete" style="background:red; color:#fff; border:1px solid #ddd;">Approve</button>`;
            if(value ==1)          TD.innerHTML = `Processed  <button class="delete" style="background:red; color:#fff; border:1px solid #ddd;">Approve</button>`;
            // if(value ==2)          TD.innerHTML = `<button  style="background:Green; border:1px solid #ddd;">Approved </button>`;
            // if(value ==3)          TD.innerHTML = `<button  style="background:red; border:1px solid #ddd;">Rejected </button>`;


          return TD;
        }
        }
      ],
      afterOnCellMouseDown: (event, coords, TD) => {
        if (event.realTarget.nodeName.toLowerCase() === 'button' && coords.col === 4) {
          this.updateData(coords["row"],coords["col"] );

        }
      },
    colHeaders: ["Code#", "Type", " Date", "Remarks", "Status"],
    manualRowMove: true,
    manualColumnMove: true,
    contextMenu: true,
    filters: true,
    dropdownMenu: true,
    afterValidate: function(isValid, value, row, prop){

      console.log(row);

      if(value == false){

        	console.log( value, row, prop)    
          alert("Invalid")
          //Value = isValid
          // row = inserted invalid value
          //prop = row index changed
      }
			
    }
  };
  companies: any;
  staffList: any;


  updatestatus(){

    return "<h1>sdfdsfds</h1>"
  }
  showDialog() {
      this.display = true;
  }

  updateService(servId:number){

    this.serviceReqService.UpdateApprovalData(servId,this.currentUserData.id ).subscribe(res=>{

      if(res==null)

    this.messageService.add({ severity: 'error', summary: 'Network error', detail: 'Netwrok error, try again' });
    else
    
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Approval Successful ' });
this.ReloadData();

  },
  err=>{
    this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'cant Approve ' });
  }
    )
}



  updateData(row:number, col:number){

    this.serviceReqService.UpdateApprovalData(this.ServiceDatas[row]["serviceReqId"],this.currentUserData.id ).subscribe(res=>{

      if(res==null)

    this.messageService.add({ severity: 'error', summary: 'Network error', detail: 'Netwrok error, try again' });
    else
    
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Approval Successful ' });
this.ReloadData();

  },
  err=>{
    this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'cant Approve ' });
  }
    )
}
  /** Hands-on-table  */
  
  /*any[] = [
    {id: 1, leavetype: 'Annual leave', from: '02-01-2018', to: '02-01-2018',totaldays:8, reason:'reson text', reqdate:'25-12-2017', status:'<button  style="background:yellow; border:1px solid yellow;padding:4px;">Pending</button>'},
  ];*/
  constructor(private serviceReqService:ServiceReqService,
    private authService:AuthenticationService,
    private navCtrl: Router,
    private messageService: MessageService,
     private LeavdataService:LeaveDataService,
     private ServiceReqService: ServiceReqService,

    ) { }

  ngOnInit(): void {
this.currentUserData = this.authService.currentUserValue;
  //    this.serviceReqService.ReadAllServiceDatas().subscribe(res=>{

  //     this.ServiceDatas = res;

  //     console.log(res,'Ajay1');
  //  }
  //  );
  this.GeComapnyMasterGroup()
  this.getServiceType()
  this.GetallStaff()
  this.filterData();
  }


  ReloadData(){
  

    this.filterData();
  }

  filterData() {
   
    var fromDateStr="";
    var endDateStr="";
    var empNameStr=null;
    var companyId=null;
    var serviceTypeId=null;
    if(this.fromdate==null)
    fromDateStr="01-01-1900";
    else
    fromDateStr=this.fromdate.toDateString();
    if(this.enddate==null)
    endDateStr="01-01-2080";
  else
  endDateStr=this.enddate.toDateString();
  if(this.empName==null || this.empName==undefined || this.empName=="")
  {
    empNameStr=-1;
   
  }
  else
  {
    empNameStr=this.empName;
  }
  if(this.filtercompany==null || this.filtercompany==undefined || this.filtercompany=="")
    {
      companyId=-1;
     
    }
    else
    {
      companyId=this.filtercompany;
    } 
    if(this.serviceTypee==null || this.serviceTypee==undefined || this.serviceTypee=="")
      {
        serviceTypeId=-1;
       
      }
      else
      {
        serviceTypeId=this.serviceTypee.serviceReqTypeId;
      } 
  this.serviceReqService.ReadAllServiceDatas(empNameStr, fromDateStr,endDateStr,companyId,serviceTypeId).subscribe(res=>{
    this.ServiceDatas = res;
  }
  );
  this.display = false;


  };



  /** HANDSONTABLE FUNCTION  */
  
  detectChanges = (hotInstance, changes, source) => {
    console.log(changes);

  };


  Aprovalforward(servid:number){
    this.navCtrl.navigate(['/user/serviceapproval'],{
      queryParams: {
        serviceId: servid
      } ,queryParamsHandling: 'merge',
    });
  }

  GeComapnyMasterGroup() {
    this.LeavdataService.GetCompanyMasterDropdown().subscribe((response: any) => {
      //   alert(JSON.stringify(response))
      if (response && response.length > 0) {

        this.companies = response.map((data) => ({
          label: data.name,
          value: data.id
        }))

        this.companies.unshift({ label: '--Select--', value: -1 });
        // alert(JSON.stringify(this.companies))
      }
    })
  }
  getServiceType(){
  this.ServiceReqService.GetServiceType().subscribe(res => {
    this.ServiceType = res;
  })
}
GetallStaff(){
  this.LeavdataService.GetallStaff().subscribe(res=>{
    if (res && res.length > 0) {
      this.staffList = res.map((data) => ({
        label: data?.fullName,
        value: data?.staffId
      }))

      this.staffList.unshift({ label: '--Select--', value: -1 });
      // alert(JSON.stringify(this.companies))
    }

  })
}
}

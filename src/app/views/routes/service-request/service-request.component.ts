import { Component, OnInit } from '@angular/core';
import { LeaveDataService } from 'src/app/_services/leaveData.service';
import { AuthenticationService } from 'src/app/_services';
import { User } from 'src/app/_models/user';
import { ViewLeaveDataModel } from 'src/app/_models/viewLeavData.model';
import { ServiceReqService } from 'src/app/_services/serviceReq.service';
import { ViewServiceRequestModel } from 'src/app/_models/viewserviceReq.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-service-request',
  templateUrl: './service-request.component.html',
  styleUrls: ['./service-request.component.scss']
})
export class ServiceRequestComponent implements OnInit {

  display: boolean = false;
  currentUserData:User;
  ServiceDatas: Array<ViewServiceRequestModel>;
  fromdate: Date;
  enddate: Date;
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
            if(value ==0)          TD.innerHTML = `Pending  <button class="delete" style="background:red; color:#fff; border:1px solid #ddd;">Delete</button>`;
            if(value ==1)          TD.innerHTML = `Processed  <button class="delete" style="background:red; color:#fff; border:1px solid #ddd;">Delete</button>`;
            if(value ==2)          TD.innerHTML = `<button  style="background:Green; border:1px solid #ddd;">Approved </button>`;
            if(value ==3)          TD.innerHTML = `<button  style="background:red; border:1px solid #ddd;">Rejected </button>`;


          return TD;
        }
        }
      ],
      afterOnCellMouseDown: (event, coords, TD) => {
        if (event.realTarget.nodeName.toLowerCase() === 'button' && coords.col === 4) {
          this.delete(coords["row"],coords["col"] );

        }
      },
    colHeaders: ["CODE#", "Type", " Date", "Remarks", "Status"],
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


  updatestatus(){

    return "<h1>sdfdsfds</h1>"
  }
  showDialog() {
      this.display = true;
  }

  deleteService(Servid:number){

    this.serviceReqService.DeleteLeaveData(Servid ).subscribe(res=>{

      if(res==null)

    this.messageService.add({ severity: 'error', summary: 'Network error', detail: 'Netwrok error, try again' });
    else
    
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully deleted ' });
this.ReloadData();

  },
  err=>{
    this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'cant delete ' });
  }
    )
}

  delete(row:number, col:number){

    this.serviceReqService.DeleteLeaveData(this.ServiceDatas[row]["serviceReqId"] ).subscribe(res=>{

      if(res==null)

    this.messageService.add({ severity: 'error', summary: 'Network error', detail: 'Netwrok error, try again' });
    else
    
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully deleted ' });
this.ReloadData();

  },
  err=>{
    this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'cant delete ' });
  }
    )
}
  /** Hands-on-table  */
  
  /*any[] = [
    {id: 1, leavetype: 'Annual leave', from: '02-01-2018', to: '02-01-2018',totaldays:8, reason:'reson text', reqdate:'25-12-2017', status:'<button  style="background:yellow; border:1px solid yellow;padding:4px;">Pending</button>'},
  ];*/
  constructor(private serviceReqService:ServiceReqService,
    private authService:AuthenticationService,
    private messageService: MessageService,

    ) { }

  ngOnInit(): void {
this.currentUserData = this.authService.currentUserValue;
     this.serviceReqService.ReadServiceDatas(this.currentUserData.id).subscribe(res=>{

      this.ServiceDatas = res;

    //   console.log(res);
   }
   );
  }


  ReloadData(){
    this.serviceReqService.ReadServiceDatas(this.currentUserData.id).subscribe(res=>{
      this.ServiceDatas = res;
      console.log("getall",res)

    }
    );
    this.display = false;
  }

  filterData() {
    if (this.fromdate != null && this.enddate != null)
      this.serviceReqService.FilterServiceDatas(this.currentUserData.id, this.fromdate.toDateString(), this.enddate.toDateString()).subscribe(res => {
        this.ServiceDatas = res;
      //  this.title = this.fromdate.toDateString() + "  - " + this.enddate.toDateString() + " (" + this.LeaveDatas.length + ")";

      }
      );
  };

  /** HANDSONTABLE FUNCTION  */
  
  detectChanges = (hotInstance, changes, source) => {
    console.log(changes);

  };



}

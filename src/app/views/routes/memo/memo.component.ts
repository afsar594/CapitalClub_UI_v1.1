import { Component, OnInit } from '@angular/core';
import { MemoService } from 'src/app/_services/memo.service';
import { MemoModel } from 'src/app/_models/memo.model';
import { AuthenticationService } from 'src/app/_services';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-memo',
  templateUrl: './memo.component.html',
  styleUrls: ['./memo.component.scss']
})
export class MemoComponent implements OnInit {

  memodatas:Array<MemoModel>;
  currentUserData:User;
  /** Handsontable  */
  tableSettings: any = {
    //rowHeaders: true,
    //colHeaders: true,
    viewportColumnRenderingOffset: 27,
    viewportRowRenderingOffset: "auto",
    //colWidths: 150,
    height: 450,
    // allowInsertColumn: false,
    // allowInsertRow: false,
    // allowRemoveColumn: false,
    // allowRemoveRow: false,
    // autoWrapRow: false,
    // autoWrapCol: false,
   stretchH: "all",
  //  width: 600,
    // autoWrapRow: true,
    //height: 487,
    maxRows: 22,
    manualRowResize: false,
    manualColumnResize: false,
    autoWrapRow: true,
    minSpareRows: false,
    columnSorting: true,
  fillHandle: false,
  licenseKey: 'non-commercial-and-evaluation',

    // rowHeaders: true,
     columns: [
        {
          data: 'memoId',
          type: 'numeric',
          width: 40,
          readOnly: true

        },
        {
          data: 'memoDate',
          
          type: 'date',
          readOnly: true,
          dateFormat: 'MM/DD/YYYY'
                },
                {
                  data: 'reply',
                  type: 'text',
                  readOnly: true
                },
                {
                  data: 'remarks',
                  type: 'text',
                  readOnly: true,
                }
       
      ],
    colHeaders: ["Memo ID", "Date", "Reply", "Remarks"],
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
  constructor(private MemoService:MemoService,
    private authService:AuthenticationService
    ) { }

  ngOnInit(): void {
    this.currentUserData = this.authService.currentUserValue;

    this.MemoService.ReadMemoDatas(this.currentUserData.id).subscribe(res=>
      {
        this.memodatas= res;
      })  }

}

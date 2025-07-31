import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-opening-balance-entry',
  templateUrl: './opening-balance-entry.component.html',
  styleUrls: ['./opening-balance-entry.component.scss']
})
export class OpeningBalanceEntryComponent implements OnInit {

  
  /** Handsontable  */
  tableSettings: any = {
    rowHeaders: true,
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
    minSpareRows: true,
    columnSorting: true,
  fillHandle: false,
    // rowHeaders: true,
     columns: [
        {
          data: 'leavDataId',
          type: 'numeric',
          width: 40,

        },
        {
          data: 'leaveDataTypeNavigation.leaveType',
          type: 'text',
                },
                {
                  data: 'leaveDataFrom',
                  type: 'date',
                  dateFormat: 'MM/DD/YYYY'
                },
                {
                  data: 'leaveDataTo',
                  type: 'date',
                  dateFormat: 'MM/DD/YYYY'
                },
        {
          data: 'leaveDays',
          type: 'numeric',
          numericFormat: {
            pattern: '0'
          }
        },
        
        {
          data: 'leaveDataReason',
          type: 'text',
        
        },
        // {
        //   data: 'reqDate',
        //   readOnly: true,
        //   type: 'date',
        //   dateFormat: 'MM/DD/YYYY'
        // },
        // {
        //   readOnly: true,
        //   data: 'status',
        // renderer: (instance, TD, row, col, prop, value, cellProperties) => {
        //     console.log(value);
        //     if(value ==0)          TD.innerHTML = `<button style="background:yellow; border:1px solid #ddd;">Pending</button>`;
        //     if(value ==1)          TD.innerHTML = `<button  style="background:Green; border:1px solid #ddd;">Approved</button>`;
        //     if(value ==2)          TD.innerHTML = `<button  style="background:red; border:1px solid #ddd;">Rejected</button>`;


        //   return TD;
        // }
        // }
      ],
    colHeaders: ["Voucher No", "Ref#", "Date", "Debit", "Credit", "Narration",],
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

  constructor() { }

  ngOnInit(): void {
  }

}

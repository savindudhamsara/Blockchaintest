import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { Patient } from 'src/app/model/patient';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { doctor } from 'src/app/model/doctor';
import { book } from 'src/app/model/book';
import { BlockchainService } from 'src/app/shared/blockchain.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewDocumentsComponent } from 'src/app/modules/patient/view-documents/view-documents.component';

@Component({
  selector: 'app-documentdoc',
  templateUrl: './documentdoc.component.html',
  styleUrls: ['./documentdoc.component.css']
})
export class DocumentdocComponent implements OnInit{
  page: number = 1;
  count: number = 0;
  tableSize: number= 8;
  tableSizes : any = [5,10,15,20];

  // patientObj : Patient = {
  //   id: '',
  //   first_name: '',
  //   last_name: '',
  //   age: '',
  //   address:'',
  //   mobileno:'',
  //   document:'',
  //   email: ''
  // };

  id:string='';
  first_name:string ='';
  last_name:string ='';
  age:string ='';
  address:String='';
  mobileno:String='';
  document: String='';
  bookDetails!: book[];
  patientId!: string;
  patientList : Patient[] =[];
  public downloadURL !: string;

  constructor(private crud:DataService ,
    private dialog: MatDialog,
    public bs: BlockchainService,
             private storage: AngularFireStorage){}

  ngOnInit(){
    const jwtToken = localStorage.getItem('doctorjwt');

    this.bs.getReceiveFile(jwtToken).subscribe((res: any) => {
      const asset = res.assetId;
      this.bs.downloadFile(jwtToken, asset).subscribe((res: any) => {
        this.downloadURL = res;
        console.log(this.downloadURL);
        
      })
    })

    this.crud.getBookedDoctorDetailsById("db766Ts0sSW35dGQQNTXnuKIuEF3").then((res) => {
      this.bookDetails = res
      for(let patient of res)
      {
        this.patientId = patient.patientID
        this.crud.getPatientDataByID(this.patientId).then (res => {
          this.patientList = res
        })
      }
    })
   }

   openDocumentDialog(patientID: string) {
    this.dialog.open(ViewDocumentsComponent,{
      data: {patientID}
    })
  }

   
//   getAllPatients(){
//     this.data.getAllPatients().subscribe(res => {
//       this.patientList = res.map((e:any) => {
//         const data =e.payload.doc.data();
//         data.id = e.payload.doc.id;
//         console.log(data);
//         return data;
     
//       }
//       )
//       console.log(this.patientList.values)

//     }, (_err:any) => {
//       alert('Error while fetching patient data');
//       console.log(this.patientList.values)
//     })
//   }



 


// UpdatePatient(){


// }


   
// onTableDataChange(event:any){
//       this.page =event;
//       this. getAllPatients();
//     }

//     onTableSizeChange(event: any):void{
//       this.tableSize =event.target.value;
//       this.page = 1;
//       this. getAllPatients();
//     }
// }
  }

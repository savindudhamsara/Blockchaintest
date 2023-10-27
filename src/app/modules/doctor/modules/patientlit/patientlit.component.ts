import { Component } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { Patient, document } from 'src/app/model/patient';
import { map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BookingactdoComponent } from '../bookingactdo/bookingactdo.component';

@Component({
  selector: 'app-patientlit',
  templateUrl: './patientlit.component.html',
  styleUrls: ['./patientlit.component.scss']
})
export class PatientlitComponent{
  page: number = 1;
  count: number = 0;
  tableSize: number= 8;
  tableSizes : any = [5,10,15,20];

  patientList : Patient[] =[];
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
  email: String='';

  constructor(
    private data:DataService,
    private dialog: MatDialog
    ){}

  ngOnInit(): void {
    this.getAllPatients();
   }

   
  getAllPatients(){
    this.data.getAllPatients().subscribe (patients => {
      patients.forEach(patient => {
        const patientId = patient.patientID;
        this.data.getPatientDataByID(patientId).then (res => {
          this.patientList = res
        })
      })
    })
  }

  AcceptPatientPopup(firstName: string, patientId: string){
    this.dialog.open(BookingactdoComponent, {
      data: {
        patientName: firstName,
        patientID: patientId,
      }
    })
  }

  // resetForm(){
  //   this.id = '';
  //   this.first_name = '';
  //   this.last_name = '';
  //   this.age = '';

  // }

 


UpdatePatient(){


}

// deletePatient(patient : Patient){
//   if(window.confirm('Are you sure you want to delete'+patient.first_name+' '+patient.last_name+' '+'?')){
//   this.data.deletePatient(patient);
//   }
// }
   
onTableDataChange(event:any){
      this.page =event;
      this. getAllPatients();
    }

    onTableSizeChange(event: any):void{
      this.tableSize =event.target.value;
      this.page = 1;
      this. getAllPatients();
    }
}
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Data } from '@angular/router';
import { log } from 'console';
import { DataService } from 'src/app/shared/data.service';


@Component({
  selector: 'app-book-doctor',
  templateUrl: './book-doctor.component.html',
  styleUrls: ['./book-doctor.component.css']
})
export class BookDoctorComponent implements OnInit {

  doctorName!: string
  currentDateTime!: Date
  today = new Date().toDateString()
  time = new Date().toLocaleTimeString()
  recievedRow: any;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public dialog: MatDialog,
    private dataService: DataService,
  ){
    this.recievedRow = data
  }

  ngOnInit() {
  }

  bookDoctor(doctorID: string, patientID: string) {
    console.log(patientID, doctorID, this.today, this.time);
    
    this.dataService.acceptPatientBooking(patientID, doctorID, this.today, this.time);
    this.dialog.closeAll()
  }

  cancelBook(){
    this.dialog.closeAll()
  }

}

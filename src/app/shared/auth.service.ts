import { Injectable } from '@angular/core';
 import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
// import { Observable, switchMap } from 'rxjs';
// import { Users } from '../model/users';
import * as fs from "fs";

import { BlockchainService } from './blockchain.service';
import firebase from 'firebase/compat/app';
import { HttpClient } from '@angular/common/http';
import 'firebase/compat/firestore';
import { AngularFirestore, DocumentSnapshot } from '@angular/fire/compat/Firestore';
import { Observable, catchError, from, throwError } from 'rxjs';
import { FirebaseError } from 'firebase/app';
// import * as firebase from 'firebase/compat';
//  import { FireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getDocuments() {
    throw new Error('Method not implemented.');
  }
  error(arg0: string) {
    throw new Error('Method not implemented.');
  }
  // signInWithEmailAndPassword(_email: any, _password: any) {
  //   throw new Error('Method not implemented.');
  // }
  fireauth: any;

  constructor(private afAuth: AngularFireAuth, 
            private http: HttpClient,
            private router: Router,
            private firestore: AngularFirestore,
            private bc:BlockchainService
            ) {}


            signUp(email: string, password: string, role: string, first_name:string,last_name:string, userAudio: string) {
              return this.afAuth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                  const user = userCredential.user;
                  if (user) {
                    this.firestore.collection(role === 'doctor' ? 'doctors' : 'patients').doc(user.uid).set({ 
                      id: user.uid,
                      role: role, 
                      first_name:first_name,
                      last_name:last_name,
                      userAudio: role === 'patient' ? userAudio : null,
                      age: '',
                      address: '',
                      mobileNo: '',
                      email:'',
                      Documents: ''
                    });
                  }
                })
                .catch((error) => {
                  console.log('Error signing up:', error);
                });
            }

            signInDoctor(email: string, password: string) {
               this.afAuth.signInWithEmailAndPassword(email, password)
                .then((res:any) => {
                  localStorage.setItem('token', 'true');
                  const uid = res.user?.uid;
                  if (uid) {
                    firebase.firestore().collection('doctors').doc(uid).get()
                      .then((doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>) => {
                        if (doc.exists) {
                          const data = doc.data();
                          if (data && data['role'] === 'doctor') {
                             this.generateJWTToken().then((res:any)=> {
                              localStorage.setItem('doctorjwt',res);
                          });
                            this.router.navigate(['/doctor'], {queryParams:{DoctorId: uid}});
                          } else {
                            alert("Inavlid Username or Password");
                            window.location.reload();
                          }
                        } else {
                          // Handle document not found
                        }
                      })
                      .catch((error: any) => {
                        console.log(error);
                        throw error;
                      });
                  } else {
                    throw new Error('User authentication failed.');
                  }
                })
                .catch((err:any) => {
                  alert(err.message);
                  this.router.navigate(['/signin']);
                });
            }

            signInPatient(email: string, password: string, event: any) {
              this.afAuth.signInWithEmailAndPassword(email, password)
               .then((res:any) => {
                 localStorage.setItem('token', 'true');

                 const uid = res.user?.uid;
  
                 if (uid) {
                   firebase.firestore().collection('patients').doc(uid).get()
                     .then((doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>) => {
                       if (doc.exists) {
                         const data = doc.data();
                         if (data && data['role'] === 'patient') {
                          this.generateJWTToken().then((res:any)=> {
                              localStorage.setItem('jwt',res);
                          });
                          // this.router.navigate(['/patient'], {query  Params:{PatientId: uid}});
                            var audioID = data && data['userAudio'];
                            
                            this.router.navigate(['/patient'], {queryParams:{PatientId: uid}});
                            
                            const formData = new FormData();
                            formData.append('audio_file', event, event.name);
                            this.http.post(`http://127.0.0.1:8000/prediction/${audioID}`, formData).subscribe
                              ((res: any) => {
                                let response = res.command;
                                console.log(response);
                                
                                if(response == 1) {
                                  this.router.navigate(['/patient'], {queryParams:{PatientId: uid}});
                                }
                              })
                            
                         } else {
                          alert("Inavlid Username or Password");
                          window.location.reload();
                         }
                       } else {
                         // Handle document not found
                       }
                     })
                     .catch((error: any) => {
                       console.log(error);
                       throw error;
                     });
                 } else {
                   throw new Error('User authentication failed.');
                 }
                 
               })
               .catch((err:any) => {
                 alert(err.message);
                 this.router.navigate(['/signinpatient']);
               });
               return 1;
           }

           async generateJWTToken(): Promise<string | null> {
            try {
              const user = await this.afAuth.currentUser;
              if (user) {
                const token = await user.getIdToken();
                return token;
              }
              return null;
            } catch (error) {
              console.error('Error generating JWT token', error);
              return null;
            }
          }


           signOutDoctor() {
            this.afAuth.signOut()
              .then(() => {
                localStorage.removeItem('token');
                this.router.navigate(['/signin']);
              })
              .catch((error: any) => {
                console.log(error);
              });
          }
        
          signOutPatient() {
            this.afAuth.signOut()
              .then(() => {
                localStorage.removeItem('token');
                this.router.navigate(['/signinpatient']);
              })
              .catch((error: any) => {
                console.log(error);
              });
          }

     


        
        
          }
          
        
          
          
          
          
          




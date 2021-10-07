import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class MessengerService {

  constructor(private http: HttpClient) { }
  baseURL = environment.baseURL;

  getMessengerByID(idmessengers) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/messengers/getMessengerByID', { idmessengers: idmessengers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }

  getMessengerByEmail(authData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/messengers/getMessengerByEmail', { email: authData.email, password: authData.password })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }

  getAllMembers() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.baseURL + '/messengers/getAllMembers')
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }

  createNewMember(user) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/messengers/createNewMember', user)
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }

  editMember(user) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/messengers/editMember', user)
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }

  deleteMember(idmessengers) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/messengers/deleteMember', { idmessengers: idmessengers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }
}

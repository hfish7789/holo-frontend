import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'
@Injectable({
  providedIn: 'root'
})
export class CustomerGroupsService {

  constructor(private http: HttpClient) { }
  baseURL = environment.baseURL;
  getAllCustomerGroups() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.baseURL + '/customerGroup/getAllCustomerGroups')
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
  getCustomerGroupByID(idcustomerGroup){
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customerGroup/getCustomerGroupByID', { idcustomerGroup: idcustomerGroup })
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

  createCustomerGroup(customerGroup) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customerGroup/createCustomerGroup', { customerGroup })
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

  editCustomerGroup(idcustomerGroup, name) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customerGroup/editCustomerGroup', { idcustomerGroup: idcustomerGroup, name: name })
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

  deleteCustomerGroup(idcustomerGroup) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customerGroup/deleteCustomerGroup', { idcustomerGroup: idcustomerGroup })
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

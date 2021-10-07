import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class PackageTypeService {

  constructor(private http: HttpClient) { }
  baseURL = environment.baseURL;

  getAllPackageTypes() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.baseURL + '/packageType/getAllPackageTypes')
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
  getPackageTypeByID(idpackageType){
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/packageType/getPackageTypeByID', { idpackageType: idpackageType })
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

  createPackageType(packageType) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/packageType/createPackageType', { packageType })
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

  editPackageType(idpackageType, name) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/packageType/editPackageType', { idpackageType: idpackageType, name: name })
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

  deletePackageType(idpackageType) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/packageType/deletePackageType', { idpackageType: idpackageType })
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

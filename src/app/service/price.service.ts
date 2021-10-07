

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  constructor(private http: HttpClient) { }
  baseURL = environment.baseURL;

  getPrice(idcustomerGroup, idareas, idpackageType){
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/price/getPrice', { idcustomerGroup: idcustomerGroup, idareas: idareas , idpackageType:idpackageType})
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

  editPrice(idcustomerGroup,idpackageType, idareas, price) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/price/editPrice', { idcustomerGroup: idcustomerGroup, idpackageType: idpackageType, idareas: idareas, price: price })
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


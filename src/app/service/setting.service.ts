import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'
@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private http: HttpClient) { }
  baseURL = environment.baseURL;
  getSettings() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.baseURL + '/setting/getSettings')
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

  saveSettings(settings) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/setting/saveSettings', { settings : settings })
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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient,) { }
  baseURL = environment.baseURL;
  sendmail(email) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/sendmail', email)
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


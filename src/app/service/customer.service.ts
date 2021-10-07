import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient,) { }
  baseURL = environment.baseURL;

  getAll() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.baseURL + '/customer/getAllCustomers')
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
  createNew(newCustomer) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/createNew', newCustomer)
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
  deleteCustomerByID(idcustomers) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/deleteCustomerByID', { idcustomers: idcustomers })
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

  getCustomerByID(idcustomers) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/getCustomerByID', { idcustomers: idcustomers })
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

  updateStatus(idcustomers, status) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/updateStatus', { idcustomers: idcustomers, status: status })
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
  resetPwd(email, password) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/resetPwd', { email: email, password: password })
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
  updateProfile(idcustomers, customer) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/updateProfile', { idcustomers: idcustomers, customer: customer })
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
  getCustomerByEmail(authData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/getCustomerByEmail', { email: authData.email, password: authData.password })
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
  getCustomerByTempToken(token) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/getCustomerByTempToken', { token: token })
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
  getCustomerByOnlyEmail(email) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/getCustomerByOnlyEmail', { email: email })
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
  getCommentsByCustomer(idcustomers) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/getCommentsByCustomer', { idcustomers: idcustomers })
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
  createCommentsByCustomerAndAdminID(idadmin, idcustomers, comments) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/createCommentsByCustomerAndAdminID', { idadmin: idadmin, idcustomers: idcustomers, comments: comments })
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
  createCustomerLog(idadmin, idcustomers, description){
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/createCustomerLog', { idadmin: idadmin, idcustomers: idcustomers, description: description })
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

  getLogsByCustomer(idcustomers) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/getLogsByCustomer', { idcustomers: idcustomers })
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
  setResetPwdToken(email, token){
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/setResetPwdToken', { email: email, token: token })
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

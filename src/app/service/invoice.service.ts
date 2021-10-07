import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }
  baseURL = environment.baseURL;

  createNewInvoice(idcustomers, status, itbmsP){
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/invoice/createNewInvoice', { idcustomers: idcustomers, status: status, itbmsP: itbmsP })
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

  createNewInvoicedOrder(invoicedOrder, idinvoice){
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/invoice/createNewInvoicedOrder', { invoicedOrder: invoicedOrder, idinvoice: idinvoice })
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

  deleteInvoicedOrder(idinvoicedOrder){
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/invoice/deleteInvoicedOrder', { idinvoicedOrder: idinvoicedOrder })
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


  getAllInvoices() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.baseURL + '/invoice/getAllInvoices')
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

  getInvoiceByID(idinvoice) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/invoice/getInvoiceByID', {idinvoice: idinvoice})
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

  getInvoicesByCustomerID(idcustomers) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/invoice/getInvoicesByCustomerID', {idcustomers: idcustomers})
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

  getinvoicedOrdersByidinvoice(idinvoice){
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/invoice/getinvoicedOrdersByidinvoice', { idinvoice: idinvoice })
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

  getPaymentsByidinvoice(idinvoice){
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/invoice/getPaymentsByidinvoice', { idinvoice: idinvoice })
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

  getAllValidPayments(){
    return new Promise((resolve, reject) => {
      this.http
        .get(this.baseURL + '/invoice/getAllValidPayments')
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
  
  newPayment(payment){
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/invoice/newPayment', { payment: payment })
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

  changePaymentStatus(payment, status){
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/invoice/changePaymentStatus', { payment: payment, status: status })
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
  
  checkinvoiceForCustomer(idcustomers){
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/invoice/checkinvoiceForCustomer', { idcustomers: idcustomers})
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

  changeInvoiceStatus(invoice, status){
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/invoice/changeInvoiceStatus', { invoice: invoice, status: status })
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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { InvoiceService } from 'src/app/service/invoice.service';
import { SettingService } from 'src/app/service/setting.service';
import { EmailService } from 'src/app/service/email.service';


import { result } from 'lodash';
import { CustomerService } from './customer.service';
import { PackagesService } from './packages.service';
@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(
    private http: HttpClient,
    private invoiceService: InvoiceService,
    private settingService: SettingService,
    private emailService: EmailService,
    private customerService: CustomerService,
    private packagesService: PackagesService,


  ) { }

  baseURL = environment.baseURL;


  getOrdersByCustomer(customerID) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/orders/getOrdersByCustomer', { customerID: customerID })
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

  getCompletedOrderDetail(idorders) {
    console.log(303030303030,idorders)
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/orders/getCompletedOrderDetail', { idorders: idorders })
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

  getAllOrders() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.baseURL + '/orders/getAllOrders')
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
  createNewOrder(order, role) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/orders/createNewOrder', { order, role })
        .subscribe(
          async json => {
            var tempResult;
            tempResult = json;
            var idorders = tempResult.insertId;
            this.orderLog(idorders, '0', window.localStorage.getItem("userID")).then(async temp => {
              await this.invoiceService.checkinvoiceForCustomer(order.idcustomers).then(result => {
                tempResult = result
                if (tempResult.length == 0) {
                  this.settingService.getSettings().then(result => {
                    this.invoiceService.createNewInvoice(order.idcustomers, '0', result[0].itbms).then(result => {
                      tempResult = result;
                      this.packagesService.getPackagesByOrderID(idorders).then((pakcages: any) => {
                        var description = '';
                        description = 'Servicio de entrega ' + idorders + ' | ';
                        for (var index = 0; index < pakcages.length; index++) {
                          var len = 6 - pakcages[index].idpackages.toString().length;
                          var tmpString = 'H';
                          for (var i = 0; i < len; i++) {
                            tmpString = tmpString + '0'
                          }
                          description = description + tmpString + pakcages[index].idpackages + ', ';
                        }
                        this.invoiceService.createNewInvoicedOrder({
                          description: description,
                          price: order.cost,
                        }, tempResult.insertId).then(result => {
                          order['billing'] = tempResult.insertId;
                          order['idorders'] = idorders;
                          this.updateOrder(order).then(result => {
                          })
                        })
                      });

                    })
                  })

                }
                else {
                  var idinvoice = result[0].idinvoice;
                  setTimeout(() => {
                    this.packagesService.getPackagesByOrderID(idorders).then((pakcages: any) => {
                      console.log('pakcages~~~~~~~~');
                      console.log(pakcages);

                      var description = '';
                      description = 'Servicio de entrega ' + idorders + ' | ';
                      for (var index = 0; index < pakcages.length; index++) {
                        var len = 6 - pakcages[index].idpackages.toString().length;
                        var tmpString = 'H';
                        for (var i = 0; i < len; i++) {
                          tmpString = tmpString + '0'
                        }
                        description = description + tmpString + pakcages[index].idpackages + ', ';
                      }
                      this.invoiceService.createNewInvoicedOrder({
                        description: description,
                        price: order.cost,
                      }, result[0].idinvoice).then(result => {
                        order['billing'] = idinvoice;
                        order['idorders'] = idorders;
                        this.updateOrder(order).then(result => {
                        })
                      })
                    });
                  }, 1000);
                }
              })
              resolve(json);
            })

          },
          error => {
            reject(error);
          }
        );
    });
  }
  updateOrder(order) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/orders/updateOrder', { order })
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
  getOrdersBymessengerID(idmessengers) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/orders/getOrdersBymessengerID', { idmessengers: idmessengers })
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
  getOrderByID(idorders) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/orders/getOrderByID', { idorders: idorders })
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
  editOrderdeliveryCostByID(idorders, deliveryAddress, cost) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/orders/editOrderdeliveryCostByID', { idorders: idorders, deliveryAddress: deliveryAddress, cost })
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
  setOrderStatus(idorders, status, idmessengers) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/orders/setOrderStatus', { idorders: idorders, status: status })
        .subscribe(
          async json => {
            await this.orderLog(idorders, status, idmessengers).then(result => {
            })
            if (status == '2') {
              this.getOrderByID(idorders).then((result: any) => {
                console.log('order', result);
                this.customerService.getCustomerByID(result[0].idcustomers).then((customers: any) => {
                  var customer = customers[0];
                  console.log('customer', customer);
                  this.packagesService.getPackagesByOrderID(idorders).then((packages: any) => {
                    var tempHtml = '';
                    for (let i = 0; i < packages.length; i++) {
                      var tempTracking = "H"

                      for (var j = 0; j < (6 - packages[i].idpackages.toString().length); j++) {
                        tempTracking = tempTracking + '0';
                      }
                      packages[i].tracking = tempTracking + packages[i].idpackages;
                      tempHtml = tempHtml + '<div style="display: flex;">Paquete ' + (i + 1).toString() + ' | Tracking<div>&nbsp;' + packages[i].tracking + '</div></div>';
                    };
                    var html = '<div style="display: flex;"><div>Hola</div> &nbsp;<div>' + customer.firstName + '&nbsp;' + customer.lastName + '</div></div><br>' +
                      '<div>La Orden #' + idorders.toString() + '&nbsp;con los siguientes paquetes se ha marcado como<strong>&nbsp;Entregada</strong>.</div><br>' + tempHtml
                      + '<br><div>Puedes comprobar el estado de tu orden y ver más detalles al acceder a tu cuenta en</div><div>https://clientes.holoexpresspanama.com/</div><br><div>Si tienes preguntas acerca de tu orden o si deseas dejarnos algún comentario para mejorar nuestro servicio, puedes enviarnos un email a info@holoexpresspanama.com</div><br><div>Gracias por confiar en nosotros,</div><br><div>¡Te deseamos un excelente día!</div><div><strong>Holo Express! #LlegandoADondeEstes</strong></div>';
                    var config = {
                      email: customer.email,
                      title: "Bienvenido a HoloExpress",
                      html: html
                    }
                    console.log(config);
                    this.emailService.sendmail(config).then(result => {
                      console.log(result);
                      window.alert("correo electrónico entregado correctamente")
                    }).catch(err => {
                      console.log(err);
                      window.alert("Lamentablemente, el mensaje no se entregó.");
                    })
                  })
                })
              })
            }
            else if (status == '1') {
              this.getOrderByID(idorders).then((result: any) => {
                console.log('order', result);
                this.customerService.getCustomerByID(result[0].idcustomers).then((customers: any) => {
                  var customer = customers[0];
                  console.log('customer', customer);
                  this.packagesService.getPackagesByOrderID(idorders).then((packages: any) => {
                    var tempHtml = '';
                    for (let i = 0; i < packages.length; i++) {
                      var tempTracking = "H"

                      for (var j = 0; j < (6 - packages[i].idpackages.toString().length); j++) {
                        tempTracking = tempTracking + '0';
                      }
                      packages[i].tracking = tempTracking + packages[i].idpackages;
                      tempHtml = tempHtml + '<div style="display: flex;">Paquete ' + (i + 1).toString() + ' | Tracking<div>&nbsp;' + packages[i].tracking + '</div></div>';
                    };
                    var html = '<div style="display: flex;"><div>Hola</div> &nbsp;<div>' + customer.firstName + '&nbsp;' + customer.lastName + '</div></div><br>' +
                      '<div style="display: flex;">Hemos creado la orden # ' + idorders.toString() + '&nbsp;con los siguientes paquetes.</div><br>' + tempHtml
                      + '<br><div>Puedes comprobar el estado de tu orden y ver más detalles al acceder a tu cuenta en</div><div>https://clientes.holoexpresspanama.com/</div><br><div>Si tienes preguntas acerca de tu orden o si deseas dejarnos algún comentario para mejorar nuestro servicio, puedes enviarnos un email a info@holoexpresspanama.com</div><br><div>Gracias por confiar en nosotros,</div><br><div>¡Te deseamos un excelente día!</div><div><strong>Holo Express! #LlegandoADondeEstes</strong></div>';
                    var config = {
                      email: customer.email,
                      title: "Bienvenido a HoloExpress",
                      html: html
                    }
                    console.log(config);
                    this.emailService.sendmail(config).then(result => {
                      console.log(result);
                      window.alert("correo electrónico entregado correctamente")
                    }).catch(err => {
                      console.log(err);
                      window.alert("Lamentablemente, el mensaje no se entregó.");
                    })
                  })
                })
              })
            }
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  assignOrder(idorders, idmessengers) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/orders/assignOrder', { idorders: idorders, idmessengers: idmessengers })
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

  orderLog(idorders, status, idmessengers) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/packages/orderLog', { idorders: idorders, status: status, idmessengers: idmessengers })
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

  getOrderLog(idorders) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/packages/getOrderLog', { idorders: idorders })
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

  createOrderDetail(idorders, detail, path, receiver) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/orders/createOrderDetail', { idorders: idorders, detail: detail, path: path, receiver: receiver })
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

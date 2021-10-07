import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { PackagesService } from 'src/app/service/packages.service';
import { OrdersService } from 'src/app/service/orders.service';
import { CustomerService } from 'src/app/service/customer.service';
import { result } from 'lodash';

@Component({
  selector: 'kt-courier',
  templateUrl: './courier.component.html',
  styleUrls: ['./courier.component.scss']
})
export class CourierComponent implements OnInit, OnDestroy {
  timer: any;
  searchValue;
  constructor(
    private router: Router,
    private packagesService: PackagesService,
    private ordersService: OrdersService,
    private customerService: CustomerService,
		private changeDetectorRefs: ChangeDetectorRef,

  ) { }

  assignedTo;
  tempResult;
  orderPickUp:any = [];
  orderDelivering:any = [];
  _orderPickUp:any = [];
  _orderDelivering:any = [];
  orders;
  selectedIndex;
  ngOnInit(): void {
    this.selectedIndex = 0;
    this.assignedTo = window.localStorage.getItem('userID');
    this.initial();
    this.timer = setInterval(()=>{
      this.initial();
    }, 60000);
  }
  initial(){
    this.searchValue = '';
    this.selectedIndex = 0;
    this.orderDelivering = [];
    this.orderPickUp = [];
    this._orderDelivering = [];
    this._orderPickUp = [];
    this.ordersService.getOrdersBymessengerID(this.assignedTo).then(async result => {
      this.orders = result;
      await this.orders.map(async order => {
        await this.customerService.getCustomerByID(order.idcustomers).then(async result => {
          this.tempResult = result;
          order.customer = this.tempResult[0]?.firstName;
          await this.packagesService.getPackagesByOrderID(order.idorders).then(packages => {
            this.tempResult = packages;
            order.packageStatus = this.tempResult[0].status;
            order.items = this.tempResult.length;
          })
        })
        if (order.packageStatus == 0 || order.packageStatus == 1) {
          this.orderPickUp.push(order);
          this._orderPickUp.push(order);

          this.changeDetectorRefs.detectChanges();
        }
        if (order.packageStatus == 3) {
          this.orderDelivering.push(order);
          this._orderDelivering.push(order);

          this.changeDetectorRefs.detectChanges();
        }
      })
    })
  }
  viewOrderDetail(order) {
    let naviagtionExtras: NavigationExtras = {
      queryParams: order
    }
    this.router.navigate(['courier/detail'], naviagtionExtras);
  }
  ngOnDestroy() {
    clearInterval(this.timer);
  }
  async applyFilter(str){
    this.orderDelivering = [];
    this.orderPickUp = [];
    this.changeDetectorRefs.detectChanges();
    if(isNaN(Number(str))){
      if((str.substring(0,1) == 'H' || str.substring(0,1) == 'h') && str.length == 7){
        var idpackages = Number(str.substring(1));
        this._orderPickUp.map(_order => {
          this.packagesService.getPackagesByOrderID(_order.idorders).then(result => {
            var tempPackages : any = result;
            tempPackages.map(_package => {
              if (_package.idpackages == idpackages){
                this.selectedIndex = 0;
                this.orderDelivering = [];
                this.orderPickUp = [];
                this.orderPickUp.push(_order);
                this.changeDetectorRefs.detectChanges();
                return;
              }
              else {

              }
            })
          })
        })
        this._orderDelivering.map(_order => {
          this.packagesService.getPackagesByOrderID(_order.idorders).then(result => {
            var tempPackages : any = result;
            tempPackages.map(_package => {
              if (_package.idpackages == idpackages){
                this.selectedIndex = 1;
                this.orderPickUp = [];
                this.orderDelivering = [];
                this.orderDelivering.push(_order);
                this.changeDetectorRefs.detectChanges();
                return;
              }
              else {

              }
            })
          })
        })
      }
      else {

      }
    }
    else if (str == ''){
      this.initial();
    }
    else {
      console.log(this.orderPickUp, this.orderDelivering);
      this._orderPickUp.map(_order => {
        if(_order.idorders == str) {
          this.selectedIndex = 0;
          this.orderDelivering = [];
          this.orderPickUp = [];
          this.orderPickUp.push(_order);
          this.changeDetectorRefs.detectChanges();
          return;

        }
        else {

        }
      })
      this._orderDelivering.map(_order => {
        if(_order.idorders == str) {
          this.selectedIndex = 1;
          this.orderPickUp = [];
          this.orderDelivering = [];
          this.orderDelivering.push(_order);
          this.changeDetectorRefs.detectChanges();
          return;

        }
        else {

        }
      })
    }

  }

}

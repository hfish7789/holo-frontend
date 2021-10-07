import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DeliveryProofComponent } from './delivery-proof/delivery-proof.component';
import { ActivatedRoute, Router } from "@angular/router";
import { PackagesService } from 'src/app/service/packages.service';
import { PackageTypeService } from 'src/app/service/package-type.service';
import { OrdersService } from 'src/app/service/orders.service';

@Component({
  selector: 'kt-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ["tracking",'weight', 'volWeight', 'length', 'width', 'height', 'type'];
  isLinear = false;

  order;
  packages;
  tempResult;
  idpackages;
  statusTitle;
  accepted: any;
  pickedUp: any;
  bodega: any;
  porEntregar: any;
  stepperFlag: boolean;
  orderCompletedFlag: boolean;
  maxStatus: number;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private packagesService: PackagesService,
    private packageTypeService: PackageTypeService,
		private changeDetectorRefs: ChangeDetectorRef,
    private ordersService: OrdersService,

    
  ) { }

  ngOnInit(): void {
    this.maxStatus = 0;

    this.route.queryParams.subscribe(params => {
      this.order = params;
    })
    console.log("order",this.order);
    this.ordersService.getCompletedOrderDetail(this.order.idorders).then((result:any) => {
      console.log(result.length);
      if (result.length == 0){
        this.orderCompletedFlag = false;
      }
      else {
        this.orderCompletedFlag = true;

      }
    })
    this.packagesService.getPackagesByOrderID(this.order.idorders).then(result => {
      this.packages = result;
      console.log(this.packages);
      this.idpackages = this.packages[0].idpackages;
      this.packages.map(_package => {

        var len = 6 - _package.idpackages.toString().length;
        var tmpString = 'H';
        for (var i = 0; i < len; i ++) {
          tmpString = tmpString + '0'
        }
        _package.tracking = tmpString + _package.idpackages;

        console.log(_package);
        this.packageTypeService.getPackageTypeByID(_package.type).then(async result => {
          this.tempResult = result;
          console.log(this.tempResult);

          _package.typeName = this.tempResult[0]?.name;
          // console.log(_package.typeName);

          this.dataSource = new MatTableDataSource(this.packages);
          await this.track();
        })
      })
    })
  }
  deliveryProof(): void {
    const dialogRef = this.dialog.open(DeliveryProofComponent, { data: {order:this.order} });
  }
  track(){
    this.accepted = undefined;
    this.pickedUp = undefined;
    this.bodega = undefined;
    this.porEntregar = undefined;
    this.stepperFlag = false;

    console.log("idpackages", this.idpackages);
    this.packagesService.getPackageByidpackages(this.idpackages).then(result => {
      console.log(result);
      this.tempResult = result;
      if(this.tempResult.length == 0){
        this.statusTitle = "No existe";
        this.changeDetectorRefs.detectChanges();

      }
      else {
        this.ordersService.getOrderLog(this.tempResult[0].idorders).then(result => {
          console.log(result);
          var orderLogs: any;
          orderLogs = result;
          orderLogs.map(log => {
            if (log.status == '1'){
              this.accepted = log.date;
              this.stepperFlag = true;
              this.changeDetectorRefs.detectChanges();

            }
          })
          console.log(this.tempResult[0].status);
          this.packagesService.getPackageLog(this.idpackages).then(result => {
            console.log("log", result);
            var logs : any;
            logs = result;
            logs.map(log => {
              if (this.maxStatus < parseInt(log.status)){
                this.maxStatus = parseInt(log.status);
                this.changeDetectorRefs.detectChanges();

              }
              if (log.status == '2') {
                this.pickedUp = log.date;
                this.stepperFlag = true;
                this.changeDetectorRefs.detectChanges();

              }
              else if (log.status == '3') {
                this.bodega = log.date;
                this.stepperFlag = true;
                this.changeDetectorRefs.detectChanges();

              }
              else if (log.status == '5' || log.status == '4') {
                this.porEntregar = log.date;
                this.stepperFlag = true;
                this.changeDetectorRefs.detectChanges();

              }
              // else if (log.status == '4') {
              //   this.pickedUp = log.date;

              // }
              // else if (log.status == '5') {
              //   this.pickedUp = log.date;

              // }
            })
          })
        })


      }
    })
  }
}

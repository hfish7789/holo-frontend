import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PackagesService } from 'src/app/service/packages.service';
import { OrdersService } from 'src/app/service/orders.service';

@Component({
  selector: 'kt-public-tracking',
  templateUrl: './public-tracking.component.html',
  styleUrls: ['./public-tracking.component.scss']
})
export class PublicTrackingComponent implements OnInit {
  trackingID;
  scanForm: FormGroup;
  statusTitle;
  stepperFlag = false;
  tempResult;
  accepted;
  pickedUp;
  bodega;
  porEntregar;
  maxStatus: number;
  constructor(
    private fb: FormBuilder,
    private packagesService: PackagesService,
    private ordersService: OrdersService,
		private changeDetectorRefs: ChangeDetectorRef,

  ) { }

  ngOnInit(): void {
    this.stepperFlag = false;
    this.scanForm = this.fb.group({
			idControl: ['', Validators.required],
    });
    this.maxStatus = 0;
  }
  track(){
    this.maxStatus = 0;
    this.statusTitle = undefined;
    this.accepted = undefined;
    this.pickedUp = undefined;
    this.bodega = undefined;
    this.porEntregar = undefined;
    this.stepperFlag = false;
    console.log(this.trackingID);
    if(this.scanForm.invalid){
      return;
    }
    else if ( !(this.scanForm.value.idControl.length == 7 && (this.scanForm.value.idControl.substring(0,1) == 'h' || this.scanForm.value.idControl.substring(0,1) == 'H'))){
      console.log("invalid");
      this.statusTitle = "No existe";
      this.changeDetectorRefs.detectChanges();

    }
    else {
      var idpackages = Number(this.scanForm.value.idControl.substring(1));
      console.log("idpackages", idpackages);
      this.packagesService.getPackageByidpackages(idpackages).then(result => {
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
              if (log.status == '0' || log.status == '1'){
                this.accepted = log.date;
                this.stepperFlag = true;
                this.changeDetectorRefs.detectChanges();

              }
            })
            console.log(this.tempResult[0].status);
            this.packagesService.getPackageLog(idpackages).then(result => {
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
}

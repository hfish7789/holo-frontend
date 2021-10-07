import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrdersService } from 'src/app/service/orders.service';
import { environment } from 'src/environments/environment'

@Component({
  selector: 'kt-delivery-proof',
  templateUrl: './delivery-proof.component.html',
  styleUrls: ['./delivery-proof.component.scss']
})
export class DeliveryProofComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeliveryProofComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ordersService: OrdersService,
		private changeDetectorRefs: ChangeDetectorRef,

  ) { }
  proof;
  baseURL = environment.baseURL;

  ngOnInit(): void {
    console.log(this.data.order.idorders);
    this.ordersService.getCompletedOrderDetail(this.data.order.idorders).then((result:any) => {
      console.log(result[0]);
      this.proof = result[0];
      this.proof.imgPath = this.baseURL + this.proof.path.substring(3);
      this.changeDetectorRefs.detectChanges();

    });
  }

}

import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrdersService } from 'src/app/service/orders.service';
import { CustomerService } from 'src/app/service/customer.service';


@Component({
  selector: 'kt-print-label',
  templateUrl: './print-label.component.html',
  styleUrls: ['./print-label.component.scss']
})
export class PrintLabelComponent implements OnInit {
  order;
  customer;
  constructor(
    public dialogRef: MatDialogRef<PrintLabelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ordersService: OrdersService,
    private customerService: CustomerService,

  ) { }

  async ngOnInit(): Promise<void> {
    console.log(this.data);
    await this.ordersService.getOrderByID(this.data.pack.idorders).then(async result => {
      this.order = result[0];
      console.log(this.order);
      await this.customerService.getCustomerByID(this.order.idcustomers).then(async result => {
        this.customer = result[0];
        await setTimeout(() => {
          window.print();
        }, 100);
      })
    })
  }
  print(){
    
  }
}

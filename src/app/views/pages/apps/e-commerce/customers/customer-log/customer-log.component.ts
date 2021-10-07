import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerService } from 'src/app/service/customer.service';
import { result } from 'lodash';
import { MessengerService } from 'src/app/service/messenger.service';

@Component({
  selector: 'kt-customer-log',
  templateUrl: './customer-log.component.html',
  styleUrls: ['./customer-log.component.scss']
})
export class CustomerLogComponent implements OnInit {

  @Input() customerID: any;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['date', 'description', 'user'];
  logs;
  constructor(
    private customerService : CustomerService,
    private messengerService : MessengerService,

    
  ) { }

  ngOnInit(): void {
    this.customerService.getLogsByCustomer(this.customerID).then(result => {
      this.logs = result;
      this.logs.map(log => {
        console.log(log);
        this.messengerService.getMessengerByID(log.idmessengers).then(result => {
          log.admin = result[0].name;
        })
      })
      this.dataSource = new MatTableDataSource(this.logs);
    })
  }

}

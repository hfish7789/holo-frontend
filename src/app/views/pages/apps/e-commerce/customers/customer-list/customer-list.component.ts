import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NavigationExtras, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CustomerNewComponent } from '../customer-new/customer-new.component'
import { result } from 'lodash';
import { CustomerService } from 'src/app/service/customer.service';
import { OrdersService } from 'src/app/service/orders.service';
@Component({
  selector: 'kt-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  dataSourceCustomer: MatTableDataSource<any>;
  displayedColumns = ['idcustomers', 'firstName', 'lastName', 'company', 'orders', 'register', 'status'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
  }
  customers;
  tempresult;
  filterStatus;
  constructor(
    private customerService: CustomerService,
    private ordersService: OrdersService,

    private router: Router,
    public dialog: MatDialog

  ) { }
  setDataSourceAttributes() {
    this.dataSourceCustomer.paginator = this.paginator;
    this.dataSourceCustomer.sort = this.sort;
    this.dataSourceCustomer.sortingDataAccessor = (item, property): string | number => {
			switch (property) {
			  case 'register': return new Date(item.register).getTime();
			  default: return item[property];
			}
    };
  }
  applyFilter(filterValue: string) {
    console.log(filterValue);
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();

    // this.dataSourceCustomer.filterPredicate = (data: { firstName: string, lastName: string, company: string, orders: string, registered: string, status: string }, filterValue: string) =>
    //   (data.firstName?.trim().toLowerCase().indexOf(filterValue) !== -1) ||
    //   (data.lastName?.trim().toLowerCase().indexOf(filterValue) !== -1) ||
    //   (data.company?.trim().toLowerCase().indexOf(filterValue) !== -1);

    if (this.dataSourceCustomer.paginator) {
      this.dataSourceCustomer.paginator.firstPage();
    }

    this.dataSourceCustomer.filter = filterValue;
  }
  async ngOnInit(): Promise<void> {
    await this.customerService.getAll().then(result => {
      this.customers = result;
      this.customers = this.customers.reverse();
      // var i = 0;
      this.customers.map(customer => {
        this.ordersService.getOrdersByCustomer(customer.idcustomers).then(result => {
          this.tempresult = result;
          customer.orders = this.tempresult.length;
          this.dataSourceCustomer = new MatTableDataSource(this.customers);
          this.setDataSourceAttributes();
          // i++;
        })
      })

    })
  }

  addCustomer() {
    // let naviagtionExtras: NavigationExtras = {
    //   queryParams: customer
    // }
    this.router.navigate(['ecommerce/customers/new']);
    // const dialogRef = this.dialog.open(CustomerNewComponent, { data: {} });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result?.status == "success") {
    //     this.customers.push({
    //       address: result.data.address,
    //       company: result.data.company,
    //       customerGroup: result.data.type,
    //       email: result.data.email,
    //       firstName: result.data.firstName,
    //       lastName: result.data.lastName,
    //       mobile: result.data.mobile,
    //       orders: '0',
    //       phone: result.data.phone,
    //       register: result.registered,
    //       ruc: result.data.phone,
    //       status: '0'
    //     })
    //     this.dataSourceCustomer = new MatTableDataSource(this.customers);
    //     this.setDataSourceAttributes();
    //   }
    // })
  }

  filterBystatus() {
    this.dataSourceCustomer.filterPredicate = (data: { status: string }, filterValue: string) => data.status.trim().toLowerCase().indexOf(this.filterStatus) !== -1;
    const tableFilters = [];
    tableFilters.push({ id: 'status', value: this.filterStatus });
    this.dataSourceCustomer.filter = JSON.stringify(tableFilters);
    if (this.dataSourceCustomer.paginator) {
      this.dataSourceCustomer.paginator.firstPage();
    }

  }

  deleteCustomer(customer) {
    if (confirm("Can you be sure to delete this customer?")) {
      this.customerService.deleteCustomerByID(customer.idcustomers).then(result => {
        this.tempresult = result;
        if (this.tempresult.status == 'ok') {
          window.alert("Successfully Deleted!")
        }
        else {
          window.alert("Error occured!")
        }
      });
      const index: number = this.customers.indexOf(customer);
      if (index !== -1) {
        this.customers.splice(index, 1);
      }
      this.dataSourceCustomer = new MatTableDataSource(this.customers);
      this.setDataSourceAttributes();
    }
  }
  viewCustomer(customer) {
    let naviagtionExtras: NavigationExtras = {
      queryParams: customer
    }
    this.router.navigate(['ecommerce/customers/view'], naviagtionExtras);
  }
  exportToExcel() {
    var data = [];
    for (var i = 0; i < this.customers.length; i++) {
      var element: any = {};
      element['ID'] = i + 1;
      element['First Name'] = this.customers[i].firstName;
      element['Last Name'] = this.customers[i].lastName;
      element['Email'] = this.customers[i].email;
      element['Phone'] = this.customers[i].phone;
      element['Mobile'] = this.customers[i].mobile;
      element['Company'] = this.customers[i].company;
      element['Orders'] = this.customers[i].orders;
      element['Registered'] = this.customers[i].register;
      element['Status'] = this.customers[i].status == '0' ? "Active" : "InActive";
      element['Last Name'] = this.customers[i].lastName;
      data.push(element);
    }
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    var a = document.createElement('a');
    var blob = new Blob(["\ufeff", csvArray], { type: 'text/csv; charset=utf-8;' }),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = "CustomersList.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}

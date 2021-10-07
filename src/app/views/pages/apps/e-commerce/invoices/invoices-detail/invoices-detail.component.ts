import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { InvoicesNewPaymentComponent } from '../invoices-new-payment/invoices-new-payment.component'
import { CustomerService } from 'src/app/service/customer.service';
import { InvoiceService } from 'src/app/service/invoice.service';
import { MessengerService } from 'src/app/service/messenger.service';
import { SettingService } from 'src/app/service/setting.service';
@Component({
  selector: 'kt-invoices-detail',
  templateUrl: './invoices-detail.component.html',
  styleUrls: ['./invoices-detail.component.scss']
})
export class InvoicesDetailComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  dataSourcePagos: MatTableDataSource<any>;
  dataSourceLogs: MatTableDataSource<any>;

  displayedColumns = ['description','discount', 'total'];
  displayedColumnsPagos = ['paymentID', 'date', 'description', 'amount', 'user', 'actions'];
  displayedColumnsLogs = ['date', 'description', 'user'];

  title: any;
  buttonStyle: any;

  paymentStatus: string;
  invoice;
  customerInfo;
  invoicedOrders;
  subtotal;
  itbms;
  total;
  detail:any = [];
  payments;
  paymentsTotal;
  userRole;
  settings;
  paidFlag:boolean;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute,
		private changeDetectorRefs: ChangeDetectorRef,

    private customerService: CustomerService,
    private invoiceService: InvoiceService,
    private messengerService: MessengerService,
    private settingService: SettingService


  ) { }

  ngOnInit(): void {
    this.paidFlag = false;
    this.userRole = window.localStorage.getItem('userRole');
    this.route.queryParams.subscribe(params => {
      this.invoice = params;
      this.paymentStatus = this.invoice.paymentStatus
    });
    this.drawView();
  }
  drawView() {
    this.settingService.getSettings().then(settings => {
      this.settings = settings[0];
      this.customerService.getCustomerByID(this.invoice.idcustomers).then(result => {
        this.customerInfo = result[0];
        this.invoiceService.getinvoicedOrdersByidinvoice(this.invoice.idinvoice).then(async result => {
          this.invoicedOrders = result;
          this.detail = [];
          this.subtotal = 0;
          this.itbms = 0;
          this.total = 0;
          await this.invoicedOrders.map(invoicedOrder => {
            this.detail.push(
              {
                description: invoicedOrder.description,
                discount: '',
                total: invoicedOrder.price,
              }
            )
            this.subtotal = (Number(this.subtotal) + Number(invoicedOrder.price)).toFixed(2);
          })
          this.itbms = (this.subtotal * Number(this.invoice.itbmsP)/100).toFixed(2);
          this.total = (Number(this.subtotal) + Number(this.itbms)).toFixed(2);
          this.detail.push({
            discount: 'Sub Total',
            description: '',
            total: this.subtotal,
          },
          {
            discount: 'itbms',
            description: '',
            total: this.itbms,
          },
          {
            discount: 'Total',
            description: '',
            total: this.total,
          });
          this.dataSource = new MatTableDataSource(this.detail);
          this.changeDetectorRefs.detectChanges();
          this.paymentsTotal = 0;
          this.invoiceService.getPaymentsByidinvoice(this.invoice.idinvoice).then(result => {
            this.payments = result;
            this.payments.map(payment => {
              this.messengerService.getMessengerByID(payment.user).then(result => {
                payment.userName = result[0].name;
                this.dataSourcePagos = new MatTableDataSource(this.payments);
                this.changeDetectorRefs.detectChanges();
              })
              if(payment.status == '0'){
                this.paymentsTotal = Number(this.paymentsTotal) + Number(payment.amount);
                this.paymentsTotal = this.paymentsTotal.toFixed(2);
                this.changeDetectorRefs.detectChanges();
                if (Number(this.total) - Number(this.paymentsTotal) == 0 ){
                  this.paidFlag = true;
                  this.changeDetectorRefs.detectChanges();
                }
              }
            })
          })
        })
      });
    })




    if (this.invoice.status == '0') {
      this.title = "OPEN";
      this.buttonStyle = { 'color': '#3699FF', 'background-color': '#cbe2fe' };
    }
    else if (this.invoice.status == '1') {
      this.title = "In progress";
      this.buttonStyle = { 'color': '#1bc5bd', 'background-color': '#c9f7f5' };
    }


    this.dataSourceLogs = new MatTableDataSource(this.logs);
  }
  openNewPayment() {
    const dialogRef = this.dialog.open(InvoicesNewPaymentComponent, { data: {paymentsTotal: this.paymentsTotal, total: this.total, idinvoice: this.invoice.idinvoice} });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
      // window.alert("Successfully saved!")
    })
  }

  changePaymentStatus(payment){
    if(window.confirm("are you sure to cancel this payment?")){
      console.log(payment);
      this.invoiceService.changePaymentStatus(payment,'1').then(result => {
        console.log(result);
        this.ngOnInit();
      })
    }
  }

  menuChange(event) {
    if(window.confirm("Are you be sure to change invoice status?")){
      if (this.title == "OPEN") {
        this.buttonStyle = { 'color': '#3699FF', 'background-color': '#cbe2fe' };
        console.log("OPEN")
        this.invoiceService.changeInvoiceStatus(this.invoice, '0').then(result => {
          console.log(result);
        })
      }
      else {
        this.buttonStyle = { 'color': '#1bc5bd', 'background-color': '#c9f7f5' };
        console.log("Partial")
        this.invoiceService.changeInvoiceStatus(this.invoice, '1').then(result => {
          console.log(result);
        })
      }
      window.alert("Successfully changed");
      this.title = event.target.outerText;
    }
  }

  edit(){
    let naviagtionExtras: NavigationExtras = {
      queryParams: this.invoice
    }
		this.router.navigate(['ecommerce/invoice/new'], naviagtionExtras);

  }
  closeInvoice() {
    let status = "1";
    if(window.confirm("Are you be sure to close this invoice?")){
      this.invoiceService.changeInvoiceStatus(this.invoice, status).then(result => {
        console.log(result);
        this.paymentStatus = "";
        this.drawView();
      })
    }
  }
  logs: any = [
    // {
    //   id: 0,
    //   date: '02/02/20 14:28pm',
    //   description: 'Order 32512 Price 2.34-->3.38',
    //   user: 'MRuiz',
    // },
    // {
    //   id: 1,
    //   date: '02/02/20 14:28pm',
    //   description: 'Added order 14521512 45214',
    //   user: 'JDoe',
    // },
    // {
    //   id: 2,
    //   date: '02/02/20 14:28pm',
    //   description: 'Removed custom charge 50.00',
    //   user: 'JDoe',
    // },
  ]

  printInvoice() {
    window.print();
  }

}

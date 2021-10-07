import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { conforms } from 'lodash';
import { CustomerGroupsService } from 'src/app/service/customer-groups.service';
import { CustomerService } from 'src/app/service/customer.service';

@Component({
  selector: 'kt-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.scss']
})
export class CustomerViewComponent implements OnInit {
  customer;
  tempCustomer;
  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
		private customerGroupsService: CustomerGroupsService,
		private changeDetectorRefs: ChangeDetectorRef,

    private router: Router) { }
  customerID;
  status;
  statusClass;
  tempResult;
  disabledFlag = true; //flag to check if edit 
  // values of ngmodel
  firstName;
  lastName;
  email;
  phone;
  mobile;
  company;
  register;
  address;
  ruc;
  customerGroup;
	customerGroups;

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.customer = params;
      console.log(this.customer);
      this.customerID = this.customer.idcustomers;
    });
    this.customerGroupsService.getAllCustomerGroups().then(customerGroups => {
			this.customerGroups = customerGroups;
			// this.customerGroups.push({
			// 	idcustomerGroup: '0',
			// 	name: 'Standard'
			// })
			this.customerGroups.map(customerGroup => {
				console.log(customerGroup);
				customerGroup.idcustomerGroup = customerGroup.idcustomerGroup.toString();
			})
		})
    this.customerService.getCustomerByID(this.customerID).then((result :any ) => {
      result[0]
      if (result[0].status == '0') {
        this.status = "Active";
        this.statusClass = "status3";
      }
      else {
        this.statusClass = "status2"
        this.status = "InActive";
      }
      this.firstName = result[0].firstName;
      this.lastName = result[0].lastName;
      this.email = result[0].email;
      this.phone = result[0].phone;
      this.mobile = result[0].mobile;
      this.company = result[0].company;
      this.register = result[0].register;
      this.address = result[0].address;
      this.ruc = result[0].ruc;
      this.customerGroup = result[0].customerGroup;
      this.changeDetectorRefs.detectChanges();

      
    })
  }

  back() {
    this.router.navigate(['ecommerce/customers']);
  }
  updateStatus(event) {
    if (confirm("Are you sure to change the status?")) {
      this.status = event.target.innerText;
      if (this.status == "Active") {
        this.statusClass = "status3"
        this.customerService.updateStatus(this.customer.idcustomers, '0').then(result => {
          this.tempResult = result;
          if (this.tempResult.status == 'ok') {
            window.alert("Successfully updated");
            this.customerService.createCustomerLog(window.localStorage.getItem('userID'), this.customer.idcustomers, 'status : inactive --> active').then(result => {
              console.log(result);
              this.ngOnInit();
            })
          }
          else {
            window.alert("Error Occured");
          }
        })
      }
      else {
        this.statusClass = "status2"
        this.customerService.updateStatus(this.customer.idcustomers, '1').then(result => {
          this.tempResult = result;
          if (this.tempResult.status == 'ok') {
            window.alert("Successfully updated");
            this.customerService.createCustomerLog(window.localStorage.getItem('userID'), this.customer.idcustomers, 'status :  active --> inactive').then(result => {
              console.log(result);
              this.ngOnInit();
            })
          }
          else {
            window.alert("Error Occured");
          }
        })
      }
    }
  }
  editProfile() {
    this.disabledFlag = false;
    this.tempCustomer = this.customer;
  }
  updateProfile() {
    this.disabledFlag = true;
    
    if ((this.tempCustomer.firstName == this.firstName) &&
      (this.tempCustomer.lastName == this.lastName) &&
      (this.tempCustomer.email == this.email) &&
      (this.tempCustomer.phone == this.phone) &&
      (this.tempCustomer.mobile == this.mobile) &&
      (this.tempCustomer.company == this.company) &&
      (this.tempCustomer.register == this.register) &&
      (this.tempCustomer.ruc == this.ruc) &&
      (this.tempCustomer.customerGroup == this.customerGroup) &&
      (this.tempCustomer.address == this.address)) {
    }
    else {
      if (confirm("Are you sure to update profile?")) {
        var temp = {
          address: this.address,
          ruc: this.ruc,
          company: this.company,
          email: this.email,
          firstName: this.firstName,
          lastName: this.lastName,
          mobile: this.mobile,
          phone: this.phone,
          register: this.register,
          customerGroup: this.customerGroup,
        }
        this.customerService.updateProfile(this.tempCustomer.idcustomers, temp).then(result => {
          console.log(result);
          this.tempResult = result;
          if (this.tempResult.status == 'ok') {
            window.alert("Successfully Updated!");
            var descriptions = '';
            for(var key of Object.keys(temp)){
              // console.log(key);
              if(this.tempCustomer[key] != temp[key]){
                console.log(key,this.tempCustomer[key], temp[key] );
                descriptions = descriptions  + key + " : " + this.tempCustomer[key] + " --> " +  temp[key] + " | ";
              }
            }
            console.log(descriptions);
            this.customerService.createCustomerLog(window.localStorage.getItem('userID'), this.tempCustomer.idcustomers,descriptions).then(result => {
              console.log(result);
              this.customer = this.tempCustomer;
              this.router.navigate(['ecommerce/customers']);

              this.ngOnInit();

            })
          }
          else {
            window.alert("Error occured!")
          }
        })
      }
    }
  }

}

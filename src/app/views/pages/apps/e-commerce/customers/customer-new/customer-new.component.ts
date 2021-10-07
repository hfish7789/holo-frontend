import { Component, OnInit } from '@angular/core';
// import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from 'src/app/service/customer.service';
import { CustomerGroupsService } from 'src/app/service/customer-groups.service';

import { Router } from '@angular/router';
import { EmailService } from 'src/app/service/email.service';

@Component({
	selector: 'kt-customer-new',
	templateUrl: './customer-new.component.html',
	styleUrls: ['./customer-new.component.scss']
})
export class CustomerNewComponent implements OnInit {
	customerForm: FormGroup;
	hasFormErrors = false;
	tempResult;
	customerGroups;
	constructor(
		// public dialogRef: MatDialogRef<CustomerNewComponent>,
		private fb: FormBuilder,
		private customerService: CustomerService,
		private customerGroupsService: CustomerGroupsService,
		private emailService: EmailService,

		
		private router: Router,

	) { }

	ngOnInit(): void {
		this.customerForm = this.fb.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			email: ['', Validators.compose([Validators.required, Validators.email])],
			phone: ['', Validators.compose([Validators.required])],
			mobile: ['', Validators.compose([Validators.required])],
			company: ['', Validators.compose([Validators.required])],
			ruc: ['', Validators.compose([Validators.required])],
			address: ['', Validators.compose([Validators.required])],
			type: ['', Validators.compose([Validators.required])]

		});
		this.customerGroupsService.getAllCustomerGroups().then(customerGroups => {
			this.customerGroups = customerGroups;
			// this.customerGroups.push({
			// 	idcustomerGroup: '0',
			// 	name: 'Standard'
			// })
			this.customerForm.patchValue({type: '1'})
			this.customerGroups.map(customerGroup => {
				console.log(customerGroup);
				customerGroup.idcustomerGroup = customerGroup.idcustomerGroup.toString();
			})
		})
	}
	close() {
		// this.dialogRef.close();
		
		this.router.navigate(['ecommerce/customers']);

	}
	save() {
		this.hasFormErrors = false;


		if (this.customerForm.invalid) {
			this.hasFormErrors = true;
		}
		else {
			console.log(this.customerForm.value);
			this.customerService.createNew(this.customerForm.value).then(result => {
				this.tempResult = result;
				if (this.tempResult.status = "ok") {
					// window.alert("successfully saved!(default password is 123)")
					var config = {
						email: this.customerForm.value.email,
						title: "Bienvenido a HoloExpress",
						html : '<div style="margin: auto;"><img style="width: 100px;margin-left: auto;margin-right: auto;" src="https://app.holoexpresspanama.com/assets/media/logos/holo.png"><div>Bienvenido a holoeExpress.</div><div>Tu cuenta ha sido creada y puedes crear órdenes de envíos a través de nuestra plataforma www.clientes.holoexpresspanama.com</div><div style="margin-top: 20px;">Utiliza los siguientes credenciales para ingresar:</div><div style="margin-top: 20px;">Email: '+
						this.customerForm.value.email + '</div><div>Contraseña: '+this.tempResult.password+'</div><div style="margin-top: 20px;">Gracias por preferirnos</div><div style="margin-top: 20px;">Equipo de HoloExpress</div></div>'
					}
					this.emailService.sendmail(config).then(result => {
						console.log(result);
						window.alert("correo electrónico entregado correctamente")
					}).catch(err => {
						console.log(err);
						window.alert("Lamentablemente, el mensaje no se entregó.");
					})
					this.router.navigate(['ecommerce/customers']);
					// this.dialogRef.close({ data: this.customerForm.value, status: 'success', registered: this.tempResult.registered });
				}
			}).catch(error => {
				console.log(error);
				window.alert("Please use another email, someone already used the email!")
			});
		}

	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}
}

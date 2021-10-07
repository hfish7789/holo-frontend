// Angular
import { Component, OnInit, Inject, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup ,FormBuilder,Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerService } from 'src/app/service/customer.service';
import { OrdersService } from 'src/app/service/orders.service';
import { PackagesService } from 'src/app/service/packages.service';
import { StateAreaService } from 'src/app/service/state-area.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { result } from 'lodash';
import { TranslateService } from '@ngx-translate/core';

import { PackageTypeService } from 'src/app/service/package-type.service';
import { PriceService } from 'src/app/service/price.service';
const DEMO_PARAMS = {
	// EMAIL: 'admin@demo.com',
	// PASSWORD: 'demo'
	weight: '',
};
@Component({
	selector: 'kt-order-edit',
	templateUrl: './order-edit.component.html'
})
export class OrderEditComponent implements OnInit {
	ecommerceForm: FormGroup;
	myControl = new FormControl();
	options: any = [];
	allCustomers;
	filteredOptions: Observable<string[]>;
	deliveryType;

	order :any = {deliveryType: ''};
	packages :any = [];
	states;
	deliveryAreas;
	pickUpAreas;
	deliveryArea;
	pickUpArea;

	weightType;
	lengthType;

	deletedPackage = [];

	tempResult;
	data;
	customerFix = "tetete";
	editFlag = true;

	totalPrice : number = 0;
	packageTypes;

	deliveryNoteFlag;
	pickUpNoteFlag;

	deliveryAddressNote;
	pickupAddressNote;
	tempStates;
	tempPAreas;
	tempDAreas;
	customerGroup;
	constructor(
		// public dialogRef: MatDialogRef<OrderEditComponent>,
		// @Inject(MAT_DIALOG_DATA) public data: any,
		private router: Router,
		private customerService: CustomerService,
		private ordersService: OrdersService,
		private packagesService: PackagesService,
		private stateAreaService: StateAreaService,
		private route: ActivatedRoute,
		private translate: TranslateService,
		private changeDetectorRefs: ChangeDetectorRef,
		private packageTypeService: PackageTypeService,
		private priceService: PriceService,
		private fb : FormBuilder

	) { }

	async ngOnInit(): Promise<void> {

	    this.ecommerceForm = this.fb.group({
				weight: ['', Validators.required],
	    });
		this.initValidation();
		this.deliveryNoteFlag = false;
		this.pickUpNoteFlag = false;
		this.customerGroup = '1';
		await this.route.queryParams.subscribe(params => {
			this.data = params;
		});
		this.packageTypeService.getAllPackageTypes().then(packageTypes => {
			this.packageTypes = packageTypes;
			this.packageTypes.map(type => {
				type.idpackageType = type.idpackageType.toString();
			})
		})
		this.weightType = 'kg';
		this.lengthType = 'cm';
		if (this.data.customer) {
			this.customerFix = this.data.customer;
			this.editFlag = true;
			this.order = JSON.parse(JSON.stringify(this.data));
			this.packagesService.getPackagesByOrderID(this.order.idorders).then(packages => {
				this.packages = packages;
				this.customerService.getAll().then(result => {
					this.allCustomers = result;
					this.customerGroup = this.allCustomers.find((item) => item.idcustomers == this.data.idcustomers).customerGroup;
					this.allCustomers.map(result => {
						this.options.push({ firstName: result.firstName, lastName: result.lastName, company: result.company, idcustomers: result.idcustomers, customerGroup: result?.customerGroup });
						this.changeDetectorRefs.detectChanges();
					})
					this.stateAreaService.getAllStates().then(async states => {
						this.states = [];
						this.tempStates = states;

						await this.tempStates.map(state => {
							if(state.status == '0'){
								state.idstates = state.idstates.toString();
								this.states.push(state);
							}
							this.changeDetectorRefs.detectChanges();
						})
						await this.stateAreaService.getAreasByStatesID(this.order.deliveryAddressState).then(async areas => {
							this.tempDAreas = areas;
							this.deliveryAreas = [];
							await this.tempDAreas.map(area => {
								if(area.status == '0'){
									area.idareas = area.idareas.toString();
									this.deliveryAreas.push(area);
								}
								this.changeDetectorRefs.detectChanges();
							})
						})
						await this.stateAreaService.getAreasByStatesID(this.order.pickUpAddressState).then(async areas => {
							this.tempPAreas = areas;
							this.pickUpAreas = [];
							await this.tempPAreas.map(area => {
								if(area.status == '0'){
									area.idareas = area.idareas.toString();
									this.pickUpAreas.push(area);
								}
								this.changeDetectorRefs.detectChanges();
							})
						})
					})
				})
			})


		}
		else {
			this.editFlag = false;
			this.order = {
				billing: "",
				cost: "",
				customer: "",
				date: "",
				deliveryAddress: "",
				deliveryAddressArea: "0",
				deliveryAddressState: "0",
				deliveryName: "",
				deliveryPhone: "",
				deliveryType: "0",
				idcustomers: "",
				items: "",
				pickUpAddress: "",
				pickUpAddressArea: "0",
				pickUpAddressState: "0",
				status: "0",
				unit: "",
				volWeight: "",
				weight: ""
			}
			this.packages = [{
				cost: "",
				height: "",
				length: "",
				lengthUnit: "",
				status: "",
				type: "",
				weight: "",
				weightUnit: "",
				width: "",
			}]

			this.stateAreaService.getAllStates().then(states => {
				this.states = [];
				this.tempStates = states;
				this.tempStates.map(state => {
					if(state.status == '0'){
						state.idstates = state.idstates.toString();
						this.states.push(state);
					}
					this.changeDetectorRefs.detectChanges();
				})

				this.stateAreaService.getAreasByStatesID(this.order.deliveryAddressState).then(areas => {
					this.tempDAreas = areas;
					this.deliveryAreas = [];
					this.tempDAreas.map(area => {
						if(area.status == '0'){
							area.idareas = area.idareas.toString();
							this.deliveryAreas.push(area);
						}
						this.changeDetectorRefs.detectChanges();
					})
				})
				this.stateAreaService.getAreasByStatesID(this.order.pickUpAddressState).then(areas => {
					this.tempPAreas = areas;
					this.pickUpAreas = [];
					this.tempPAreas.map(area => {
						if(area.status == '0'){
							area.idareas = area.idareas.toString();
							this.pickUpAreas.push(area);
						}
						this.changeDetectorRefs.detectChanges();
					})
				})
			})


			await this.customerService.getAll().then(async result => {
				this.allCustomers = result;
				await this.allCustomers.map(result => {
					this.options.push({ firstName: result.firstName, lastName: result.lastName, company: result.company, idcustomers: result.idcustomers , customerGroup: result?.customerGroup });
				})

			})
		}
		this.filteredOptions = this.myControl.valueChanges.pipe(
			startWith(''),
			map(value => this._filter(value))
		);
	}
	initValidation(){

		this.ecommerceForm = this.fb.group({
			weight: [DEMO_PARAMS.weight, Validators.compose([
					Validators.required,
					Validators.min(0),
					Validators.max(3)
				])
			]
		});
	}
	isControlHasError(controlName: string, validationType: string): boolean {

		const control = this.ecommerceForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}
	changeWeightType(str) {
		this.weightType = str;
	}

	changelengthType(str) {
		this.lengthType = str;
	}

	addPackage() {
		if ((this.packages[this.packages.length - 1].weight != 0) &&
			(this.packages[this.packages.length - 1].length != 0) &&
			(this.packages[this.packages.length - 1].width != 0) &&
			(this.packages[this.packages.length - 1].height != 0) &&
			(this.packages[this.packages.length - 1].weight != null) &&
			(this.packages[this.packages.length - 1].length != null) &&
			(this.packages[this.packages.length - 1].width != null) &&
			(this.packages[this.packages.length - 1].height != null)) {
			this.packages.push({
				weight: 0,
				length: 0,
				width: 0,
				height: 0,
				type: '0',
				weightUnit: 'kg',
				lengthUnit: 'cm'
			});
		}
		else {
			window.alert("Please input all fields correctly before add another package!")
		}
	}

	customerChange(option) {
		if(option.customerGroup != null && option.customerGroup != undefined && option.customerGroup != '') {
			this.customerGroup = option.customerGroup;
		}
		this.order.idcustomers = option.idcustomers;
	}

	deletePackage(_package) {
		const index: number = this.packages.indexOf(_package);
		if (index !== -1) {
			this.packages.splice(index, 1);
			this.deletedPackage.push(_package);
		}
		this.calcPrice();
	}

	async save () {
		await this.calcPrice();
		this.order.items = this.packages.length;
		if (this.checkSafeString(this.pickupAddressNote) && this.checkSafeString(this.order.pickUpAddress) && this.checkSafeString(this.order.deliveryAddress) && this.checkSafeString(this.deliveryAddressNote) ){
		} else {
			window.alert("address and note can't be over 300 characters, can't contain '.' or ','!")
			return;
		}
		console.log(this.order.idorders);
		if (this.order.idorders) {
			this.order.pickupAddressNote = this.pickupAddressNote;
			this.order.deliveryAddressNote = this.deliveryAddressNote;
			
			this.ordersService.updateOrder(this.order).then(result => {
				this.packages.map(_package => {
					if (this.deletePackage.length >= 1) {
						this.deletedPackage.map(_package => {
							this.packagesService.deletePackage(_package).then(result => {
								console.log("111111111111")
							})
						});
					}
					if (_package.idpackages) {
						this.packagesService.updatePackage(_package).then(result => {
							console.log("2222222222222222222")

						})
					}
					else {
						_package.idorders = this.order.idorders;
						_package.status = this.packages[0].status;
						_package.cost = '';
						this.packagesService.createNewPackage(_package).then(result => {
							console.log("3333333333333333333")
						})
					}
				})

				window.alert("successfully saved!");
				let naviagtionExtras: NavigationExtras = {
					queryParams: this.packages[0]
				}
				this.router.navigate(['/ecommerce/package/view'],naviagtionExtras);

				// this.dialogRef.close();
			})
		}
		else {
			this.order.pickupAddressNote = this.pickupAddressNote;
			this.order.deliveryAddressNote = this.deliveryAddressNote;

			this.ordersService.createNewOrder(this.order, '1').then(async result => {
				this.tempResult = result;
				await this.packages.map(_package => {
					_package.idorders = this.tempResult.insertId;
					if (this.order.deliveryType == '0') {
						_package.status = '2'
					}
					else {
						_package.status = '0'
					}
					_package.cost = '';
					this.packagesService.createNewPackage(_package).then(result => {

					})
				})
				window.alert("successfully saved!");
				let naviagtionExtras: NavigationExtras = {
					queryParams: this.packages[0]
				}
				this.router.navigate(['/ecommerce/package/view'],naviagtionExtras);
			})
		}
	}

	checkSafeString(string){
		if (string == undefined || string == null) {
			return true;
		}
		if (string.length > 300 || string.includes(".") || string.includes(",")) {
			return false;
		} else {
			return true;
		}
	}

	cancel() {
		this.router.navigate(['/ecommerce/orders']);
	}

	StateChange(state, str) {
		if (str == 'p') {
			this.stateAreaService.getAreasByStatesID(state.idstates).then(result => {
				// this.pickUpAreas = result;
				this.tempPAreas = result;
				this.pickUpAreas = [];
				this.tempPAreas.map(area => {
					if(area.status == '0'){
						area.idareas = area.idareas.toString();
						this.pickUpAreas.push(area);
					}
					this.changeDetectorRefs.detectChanges();
				})
			})
		}
		else {
			this.stateAreaService.getAreasByStatesID(state.idstates).then(result => {
				// this.deliveryAreas = result;
				this.tempDAreas = result;
				this.deliveryAreas = [];
				this.tempDAreas.map(area => {
					if(area.status == '0'){
						area.idareas = area.idareas.toString();
						this.deliveryAreas.push(area);
					}
					this.changeDetectorRefs.detectChanges();
				})
			})
		}

	}
	resetValidation(){
		var value = this.ecommerceForm.get("weight").value;
		if(value > 3){
			
			this.ecommerceForm.get("weight").reset();
		}
	}
	async calcPrice(event = false){
		// if(data){
		// 	this.resetValidation();
		// }
		var pickUpAreaPrice : any = null;
		var deliveryAreaPrice : any = null;
		var totalDeliveryPrice: number = 0;
		var pickUpPrice:number = 0;
		this.totalPrice = 0;
		console.log(333333333333333,this.packages);
		for (const _package of this.packages) {
			console.log("package",_package);
			if (this.deliveryArea?.idareas != undefined && _package?.type != null && _package?.type != undefined && _package?.type != '') {
				await this.priceService.getPrice(this.customerGroup,this.pickUpArea?.idareas,_package?.type).then(async (resultPickUp:any) => {
					pickUpAreaPrice = resultPickUp[0];

					await this.priceService.getPrice(this.customerGroup,this.deliveryArea?.idareas,_package?.type).then((resultDelivery:any) => {
						deliveryAreaPrice = resultDelivery[0];
						var rWeight:number = 0;
						var vWeight:number = 0;
						var deliveryPrice:number = 0;
						rWeight = parseInt(_package.weight);
						vWeight = Number(_package.height)*Number(_package.width)*Number(_package.length)/5000;

						if(rWeight > vWeight){
							if(rWeight < 5){
								deliveryPrice = Number(deliveryAreaPrice?.basePrice);
							}
							else {
								deliveryPrice = Number(deliveryAreaPrice?.basePrice) + (rWeight - 5) * Number(deliveryAreaPrice?.extraRW);
							}
						}
						else {
							if(vWeight < 5){
								deliveryPrice = Number(deliveryAreaPrice?.basePrice);
							}
							else {
								deliveryPrice = Number(deliveryAreaPrice?.basePrice) + (vWeight - 5) * Number(deliveryAreaPrice?.extraRV);
							}
						}

						totalDeliveryPrice += deliveryPrice;
					});
				});
			}
		}

		if (deliveryAreaPrice || pickUpAreaPrice) {

			if(this.order.deliveryType == '0'){
				this.totalPrice = totalDeliveryPrice + Number(deliveryAreaPrice?.locationPrice)*Number(this.packages.length);
			}
			else {
				pickUpPrice = Number(pickUpAreaPrice?.pickup);
				this.totalPrice = totalDeliveryPrice + pickUpPrice;
				if (Number(deliveryAreaPrice?.locationPrice) > Number(pickUpAreaPrice?.locationPrice)) {
					this.totalPrice = totalDeliveryPrice + pickUpPrice + Number(deliveryAreaPrice?.locationPrice)*(this.packages.length);
				} else {
					this.totalPrice = totalDeliveryPrice + pickUpPrice + Number(pickUpAreaPrice?.locationPrice)*(this.packages.length);
				}
			}
		}
		this.order.cost = this.totalPrice.toFixed(2);
		console.log(this.totalPrice);
		this.changeDetectorRefs.detectChanges();
	}

	basePrice(str, area){
		if (str == 'delivery'){
			this.deliveryArea = area;
		}
		else {
			this.pickUpArea = area;
		}
		this.calcPrice();
	}

	addNotes(str){
		if(str == 'delivery'){
			this.deliveryNoteFlag = true;
		}
		else if (str == 'deliveryDone'){
			this.deliveryNoteFlag = false;
		}
		else if (str == 'pickup'){
			this.pickUpNoteFlag = true;
		}
		else{
			this.pickUpNoteFlag = false;
		}
	}

	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.options.filter(option => option.firstName.toLowerCase().indexOf(filterValue) === 0);
	}
}

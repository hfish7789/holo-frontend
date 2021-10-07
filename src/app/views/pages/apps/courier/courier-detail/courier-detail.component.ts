import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PackagesService } from 'src/app/service/packages.service';

@Component({
  selector: 'kt-courier-detail',
  templateUrl: './courier-detail.component.html',
  styleUrls: ['./courier-detail.component.scss']
})
export class CourierDetailComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['weight', 'volWeight', 'length', 'width', 'height', 'tracking'];

  order;
  accepted: boolean;
  packages;
  constructor(
    private route: ActivatedRoute,
    private packagesService: PackagesService,
    private router: Router,
		private changeDetectorRefs: ChangeDetectorRef,
    ) { }

  ngOnInit(): void {
    this.accepted = false;

    this.route.queryParams.subscribe(params => {
      this.order = params;
      console.log(this.order);
      if (this.order.accept == "accept") {
        this.accepted = true;
      }
    })
    this.packagesService.getPackagesByOrderID(this.order.idorders).then(packages => {
      this.packages = packages;
      this.packages.map(pkg => {
        var len = 6 - pkg.idpackages.toString().length;
        var tmpString = 'H';
        for (var i = 0; i < len; i ++) {
          tmpString = tmpString + '0'
        }
        pkg.tracking = tmpString + pkg.idpackages;
        pkg.volWeight = (Number(pkg.length) * Number(pkg.length) * Number(pkg.length)/5000).toFixed(2);
        this.dataSource = new MatTableDataSource(this.packages);
        this.changeDetectorRefs.detectChanges();

      })
    })

  }
  back() {
    this.router.navigate(['courier']);
  }
  edit() {
    let naviagtionExtras: NavigationExtras = {
      queryParams: this.order
    }
    this.router.navigate(['courier/edit'], naviagtionExtras);
  }
  status() {
    if (window.confirm("Are you going to update information?")) {
      this.packages.map(_package => {
        var idmessenger = window.localStorage.getItem('userID');
        this.packagesService.setPackageStatus(_package, '1', idmessenger).then(result => {
        })
      })
      this.router.navigate(['courier']);
    }
  }
  final() {
    let naviagtionExtras: NavigationExtras = {
      queryParams: this.order
    }
    this.router.navigate(['courier/final'], naviagtionExtras);
  }
}

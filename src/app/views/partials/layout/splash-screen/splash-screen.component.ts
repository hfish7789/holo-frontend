// Angular
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// Object-Path
import * as objectPath from 'object-path';
// Layout
import { LayoutConfigService, SplashScreenService } from '../../../../core/_base/layout';

@Component({
  selector: 'kt-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent implements OnInit {
  // Public properties
  loaderType: string;
  @ViewChild('splashScreen', {static: true}) splashScreen: ElementRef;

  /**
   * Component constructor
   *
   * @param el: ElementRef
   * @param layoutConfigService: LayoutConfigService
   * @param splashScreenService: SplashScreenService
   */
  constructor(
    private el: ElementRef,
    private layoutConfigService: LayoutConfigService,
    private splashScreenService: SplashScreenService) {
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
    // init splash screen, see loader option in layout.config.ts
    const loaderConfig = this.layoutConfigService.getConfig('loader');
    this.loaderType = objectPath.get(loaderConfig, 'page-loader.type');

    this.splashScreenService.init(this.splashScreen);
  }
}

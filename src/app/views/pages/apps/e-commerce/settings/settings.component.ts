import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SettingService } from 'src/app/service/setting.service'
import { result } from 'lodash';

@Component({
  selector: 'kt-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
	settingForm: FormGroup;
  settings;
  constructor(
    private fb: FormBuilder,
    private settingService: SettingService,

  ) { }

  ngOnInit(): void {
    this.settingForm = this.fb.group({
			companyName: ['', Validators.required],
			ruc: ['', Validators.required],
			street: ['', Validators.compose([Validators.required])],
			state: ['', Validators.compose([Validators.required])],
			country: ['', Validators.compose([Validators.required])],
			itbms: ['', Validators.compose([Validators.required])],
			username: ['', Validators.compose([Validators.required])],
			password: ['', Validators.compose([Validators.required])],
			port: ['', Validators.compose([Validators.required])]
    });
    this.settingService.getSettings().then(result => {
      this.settings = result[0];
      this.settingForm.setValue({ 
        companyName: this.settings.companyName,
        ruc: this.settings.ruc,
        street: this.settings.street,
        state: this.settings.state,
        country: this.settings.country,
        itbms: this.settings.itbms,
        username: this.settings.username,
        password: this.settings.password,
        port: this.settings.port
      });

    })
  }
  save(){
    if(this.settingForm.invalid){
      return;
    }
    else {
      console.log(this.settingForm.value);
      this.settingService.saveSettings(this.settingForm.value).then(result => {
        console.log(result);
        window.alert("successfully updated!")
      })
    }
  }
}

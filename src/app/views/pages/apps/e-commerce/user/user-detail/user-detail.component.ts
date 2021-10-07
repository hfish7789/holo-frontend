import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MessengerService } from 'src/app/service/messenger.service';
import { result } from 'lodash';
import { EmailService } from 'src/app/service/email.service';

@Component({
  selector: 'kt-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  name: string;
  user: string;
  email: string;
  role: string;
  status: string;
  password;
  title;
  hide = true;
  member;
  userForm = new FormGroup({
    name: new FormControl,
    user: new FormControl,
    email: new FormControl,
    role: new FormControl,
    status: new FormControl,
    password: new FormControl,

    
  });



  constructor(
    public dialogRef: MatDialogRef<UserDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private messengerService: MessengerService,
    private emailService: EmailService,

    
  ) { }

  ngOnInit(): void {

    this.userForm = this.fb.group({
      name: ['', Validators.required],
      user: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      role: ['', Validators.required],
      status: ['', Validators.required],
      password: ['', Validators.required],

    });

    if (this.data.user != '') {
      this.userForm.setValue({
        name: this.data?.user.name,
        user: this.data?.user.user,
        status: this.data?.user.status.toString(),
        role: this.data?.user.role.toString(),
        email: this.data?.user.email,
        password: this.data?.user.password,

      })
      this.name = this.data?.user.name;
      this.user = this.data?.user.user;
      this.status = this.data?.user.status.toString();
      this.role = this.data?.user.role.toString();
      this.email = this.data?.user.email;
      this.password = this.data?.user.password;

      this.title = "edit";
    }
    else {
      this.title = "new";
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    if (this.userForm.invalid) {
      window.alert("Please input all fields correctly!")
    }
    else {
      if (this.title == 'edit') {
        this.member = this.userForm.value;
        this.member.idmessengers = this.data.user.idmessengers;
        this.messengerService.editMember(this.member).then(result => {
          window.alert("successfully saved!")
          this.dialogRef.close();
        })
      }
      else {
        this.messengerService.createNewMember(this.userForm.value).then(result => {
          console.log(result);
          var role;
          if (this.userForm.value.role == '10'){
            role  = "Super Admin";
          }
          else if (this.userForm.value.role == '2') {
            role  = "Messenger";
          }
          else {
            role  = "Admin";
          }
          var config = {
            email: this.userForm.value.email,
						title: "Bienvenido a HoloExpress",
						html : '<div style="margin: auto;"><img style="width: 100px;margin-left: auto;margin-right: auto;" src="https://app.holoexpresspanama.com/assets/media/logos/holo.png"><div>Bienvenido a holoeExpress.</div><div>Tu cuenta ha sido creada y puedes crear órdenes de envíos a través de nuestra plataforma www.clientes.holoexpresspanama.com</div><div style="margin-top: 20px;">Utiliza los siguientes credenciales para ingresar:</div><div style="margin-top: 20px;">Email: '+
						this.userForm.value.email + '</div><div>Contraseña: '+this.userForm.value.password+'</div><div>UserRole: '+role+'</div><div style="margin-top: 20px;">Gracias por preferirnos</div><div style="margin-top: 20px;">Equipo de HoloExpress</div></div>'
					}
          this.emailService.sendmail(config).then(result => {
            window.alert("Email successfully sent!")
          })
          window.alert("successfully created!")
          this.dialogRef.close();
        })
      }
    }
  }

  delete() {
    if (window.confirm("are you going to really delete this member?")) {
      this.messengerService.deleteMember(this.data.user.idmessengers).then(result => {
        window.alert("successfully deleted!")
        this.dialogRef.close();
      })
    }
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FirebaseService } from '@chat/share';

@Component({
  selector: 'lib-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  rfLogin = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  constructor(private firebaseService: FirebaseService){
    // this.firebaseService.getItems()
  }
  onSubmit(){
    this.firebaseService.checkUsername(this.rfLogin.value.username ?? '',this.rfLogin.value.password ?? '')
  }
}

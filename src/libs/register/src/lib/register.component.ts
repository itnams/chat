import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService, User } from '@chat/share';

@Component({
  selector: 'lib-register',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent { 
  rfRegister = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    fullName: new FormControl('', Validators.required),
    confirmPasword: new FormControl('', Validators.required),
  });
  constructor(private firebaseService: FirebaseService){}
  onSubmit(){
    const user: User = {
      uidd: this.generateRandomBase64UrlString(),
      username: this.rfRegister.value.username ?? '',
      fullName: this.rfRegister.value.fullName ?? '',
      password: this.rfRegister.value.password ?? '',
    }
    if(this.rfRegister.value.password == this.rfRegister.value.confirmPasword){
      this.firebaseService.register(user)
    } else {
      alert("Please check password and confirm password")
    }
  }
  generateRandomBase64UrlString(): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let randomString = '';
    for (let i = 0; i < 64; i++) {
      randomString += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return btoa(randomString).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  }
}

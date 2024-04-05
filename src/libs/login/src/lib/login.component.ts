import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FirebaseService, LocalStorageService } from '@chat/share';

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
  constructor(private firebaseService: FirebaseService, private localStorageService: LocalStorageService, private router: Router) {}
  onSubmit() {
    this.firebaseService.login(this.rfLogin.value.username ?? '', this.rfLogin.value.password ?? '', (user) => {
      this.localStorageService.setItem('user', user)
      this.router.navigate(['/home']);
    })
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '@chat/share';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-login',
  standalone: true,
  imports: [CommonModule ,FormsModule ],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
 username: string = '';
  password: string = '';
  constructor(private service: FirebaseService){
    this.service.writeUserData()
  }
  onSubmit() {
    // Xử lý đăng nhập
  }
}

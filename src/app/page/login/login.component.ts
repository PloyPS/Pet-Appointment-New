import { Component } from '@angular/core';
import { LoginService } from 'src/app/service/login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']

})
export class LoginComponent {
  username: any = '';
  password: string = '';
  errorMessage: string = '';
  users: any;

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {

  }

  async login() {
    console.log('login');
    try {
      const result = await this.loginService.login(this.username, this.password);
      console.log('result', result);

      if (result.status === true) {
        console.log('login success');
        localStorage.setItem('user', JSON.stringify(result));
        this.router.navigate(['/appointment']);
      } else {
        this.errorMessage = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
      }
    } catch (error) {
      console.error('Login error:', error);
      this.errorMessage = 'เกิดข้อผิดพลาดระหว่างการเข้าสู่ระบบ';
    }
  }

}

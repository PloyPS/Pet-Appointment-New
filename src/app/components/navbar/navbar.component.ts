import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router) {}

  userData: any;
  userFullName: string = '';

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userData = JSON.parse(storedUser);
      this.userFullName = `${this.userData.user.firstname} ${this.userData.user.lastname}`;
    }
    console.log('Navbar User Data:', this.userData);
  }

  async logout() {
    console.log('logout');
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

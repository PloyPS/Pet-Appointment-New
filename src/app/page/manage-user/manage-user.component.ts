import { Component } from '@angular/core';
import { AppointmentService } from 'src/app/service/appointment/appointment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss'],
})
export class ManageUserComponent {
  user: any[] = [];
  changeUser: boolean = false;
  usersForm: any = {};
  changeUserData: any;
  users: { id: number; [key: string]: any }[] = [];
  constructor(
    private appointmentService: AppointmentService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getUser();
    this.usersForm = this.fb.group({
      userId: [{ value: null, disabled: true }],
      username: [{ value: null, disabled: true }],
      firstname: [''],
      lastname: [''],
      password: [''],
      phone: [''],
    });
  }

  getUser() {
    this.appointmentService.getUser().subscribe((res: any) => {
      console.log('res', res);
      this.users = res.actions || []; // ถ้า res.actions เป็น null ก็จะเป็น array เปล่าแทน
      console.log('users', this.users);
    });
  }

  editUser(userId: number, data: any) {
    this.appointmentService.editUser(data, userId).subscribe((res: any) => {
      console.log('res', res);
      this.user = res;
    });
  }

  removeUser(userId: number) {
    this.appointmentService.removeUser(userId).subscribe(
      (res: any) => {
        console.log('res', res);
        this.user = res;

        Swal.fire({
          icon: 'success',
          title: 'ลบข้อมูลสำเร็จ',
          text: 'ผู้ใช้ถูกลบออกจากระบบแล้ว',
        }).then(() => {
          window.location.reload();
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถลบผู้ใช้ได้',
        });
      }
    );
  }

  closeChangeUser() {
    this.changeUser = false;
  }

  openChangeUser(id: number) {
    this.changeUserData = this.users.find((u: { id: number }) => u.id === id);
    this.changeUser = true;

    if (this.changeUserData) {
      this.usersForm.patchValue({
        userId: this.changeUserData.id,
        username: this.changeUserData.username,
        firstname: this.changeUserData.firstname,
        lastname: this.changeUserData.lastname,
        password: this.changeUserData.password,
        phone: this.changeUserData.phone,
      });
    }

    console.log('changeUserData', this.changeUserData);
  }

  saveEditUser() {
    const userData = this.usersForm.getRawValue();
    const userId = userData.userId;

    this.appointmentService.editUser(userData, userId).subscribe({
      next: (res: any) => {
        this.user = res;

        // ✅ ปิด dialog ก่อน
        this.changeUser = false;

        // ✅ รอ 100ms ให้ dialog ปิด แล้วค่อยแสดง Swal
        setTimeout(() => {
          Swal.fire({
            icon: 'success',
            title: 'บันทึกสำเร็จ',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            // ✅ รีโหลดหน้า
            window.location.reload();
          });
        }, 100);
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถบันทึกข้อมูลได้',
        });
      },
    });
  }
}

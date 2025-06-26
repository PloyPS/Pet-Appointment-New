import { Component, OnInit } from '@angular/core';
import {
  AppointmentService,
  DataAppointment,
  AnimalsTypes,
} from 'src/app/service/appointment/appointment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
  providers: [DatePipe],
})
export class AppointmentComponent implements OnInit {
  userForm!: FormGroup;
  petForm!: FormGroup;
  appointmentForm!: FormGroup;
  subjectForm!: FormGroup;
  animalTypesForm!: FormGroup;

  statuses!: any[];
  data: DataAppointment[] = [];
  addUser: boolean = false;
  addAppoinment: boolean = false;
  addPet: boolean = false;
  users: any;
  userRole: any;
  userData: string | null | undefined;
  price: any;

  weight: any[] = [];
  allWeight: any[] = [];
  animalsTypes: any[] = [];
  selectedAnimalsTypes: any;
  selectedWeight!: any;
  pets: any;

  petsByUser: any[] = [];
  selectedPet: any;
  selectedSubject: any;

  selectedUserId: number[] = [];

  selectedDate: string = '';
  minDate: Date = new Date();
  subject: any[] = [];

  filteredSubjects: any[] = [];

  petWeight: number | null = null;
  form: any;

  priceValue: number | null = null;

  availableSlots: { id: number; time: string }[] = [];
  user: any;
  addSubject: boolean = false;
  changeAnimalTypes: boolean = false;

  constructor(
    private appointmentService: AppointmentService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private confirmationService: ConfirmationService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getData();
    this.getUsers();
    this.getAnimalsTypes();
    this.getPrice();
    // this.getAnimalsTypesAndWeights();
    this.getSubjects();

    this.userData = localStorage.getItem('user');
    // console.log('User Data:', this.userData);
    if (this.userData) {
      this.users = JSON.parse(this.userData);
      this.userRole = this.users.user.role;
      this.user = this.users.user.id;
      this.getPets(this.users.user.id);
    } else {
      console.error('User not found in localStorage');
    }

    this.userForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    });

    this.petForm = this.fb.group({
      name: ['', Validators.required],
      userId: ['', Validators.required],
      type: [null, Validators.required],
      breed: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      weight: [null, Validators.required],
    });

    this.appointmentForm = this.fb.group({
      selectedPet: ['', Validators.required],
      selectedSubject: ['', Validators.required],
      selectedDate: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      weight: ['', Validators.required],
      selectedTimeSlot: [null, Validators.required],
    });

    this.subjectForm = this.fb.group({
      subject: ['', Validators.required],
    });

    this.selectedDate = moment().format('YYYY-MM-DD');

    this.appointmentForm.get('selectedPet')?.valueChanges.subscribe((pet) => {
      this.filterSubjects(pet);
    });

    this.appointmentForm.controls['selectedSubject'].valueChanges.subscribe(
      (newSelectedSubject: any) => {
        console.log('selectedSubject changed:', newSelectedSubject);

        console.log('Form Values:', this.appointmentForm.value);
      }
    );

    this.appointmentForm.controls['selectedPet'].valueChanges.subscribe(
      (selectedPetId) => {
        console.log('selectedPetId changed:', selectedPetId);
        this.filterSubjects(selectedPetId);
        if (selectedPetId && selectedPetId.weight) {
          this.getWeight(selectedPetId.weight);
        }
      }
    );
    this.appointmentForm.get('selectedPet')?.valueChanges.subscribe((pet) => {
      if (pet) {
        this.selectedPet = pet;
        this.appointmentForm.patchValue({
          weight: pet.weight,
        });
        this.onSubjectSelected();
      }
    });

    this.appointmentForm.get('selectedPet')?.valueChanges.subscribe((pet) => {
      console.log('selectedPet:', pet);
      if (pet) {
        this.selectedPet = pet;
        this.appointmentForm.patchValue({
          weight: pet.weight,
        });
        this.onSubjectSelected();
      }
    });

    this.appointmentForm
      .get('selectedSubject')
      ?.valueChanges.subscribe((subject) => {
        if (subject) {
          this.selectedSubject = subject;
          this.onSubjectSelected();
        }
      });

    this.getAppointment(this.users.user.id);
    this.getAllWeight();
  }

  filterSubjects(selectedPetId: any): void {
    console.log('selectedPetId', selectedPetId);

    if (selectedPetId && selectedPetId.animalsTypes) {
      const selectedAnimalType = selectedPetId.animalsTypes;
      console.log('selectedAnimalType', selectedAnimalType);

      this.selectedPet = selectedPetId;

      if (selectedAnimalType === 2) {
        console.log('selectedAnimalType === 2');
        this.filteredSubjects = this.subject.filter(
          (subject) => subject.id !== 3
        );
      } else {
        console.log('selectedAnimalType !== 2');
        this.filteredSubjects = [...this.subject];
        console.log('this.filteredSubjects', this.filteredSubjects);
      }
      console.log('filteredSubjects after filter:', this.filteredSubjects);

      const petWeightId = this.selectedPet.weight;
      if (petWeightId) {
        this.getWeight(petWeightId);
      } else {
        console.error('petWeightId ไม่มีค่า');
      }
    } else {
      console.error('selectedPetId หรือ selectedPetId.animalsTypes ไม่มีค่า');
    }
  }

  getUsers() {
    // console.log('getUsers');
    this.appointmentService.getUser().subscribe({
      next: (res: any) => {
        // console.log('API Response:', res);

        if (Array.isArray(res.actions)) {
          this.users = res.actions.map((user: any) => ({
            id: user.id,
            name: `${user.firstname} ${user.lastname}`,
          }));
          // console.log('users', this.users);
        } else {
          console.error('Error: actions is not an array');
          this.users = [];
        }
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }

  getData() {
    this.appointmentService.getData().subscribe((res: DataAppointment[]) => {
      this.data = res || [];
    });
  }

  async getAnimalsTypes() {
    this.appointmentService.getAnimalsTypes().subscribe((res: any) => {
      if (res.status && Array.isArray(res.animailType)) {
        this.animalsTypes = res.animailType;
      } else {
        this.animalsTypes = [];
        console.error('Invalid data format for animalsTypes', res);
      }
      console.log('animalsTypes', this.animalsTypes);
    });
  }

  async getPrice() {
    this.appointmentService.getPrice().subscribe((res: any) => {
      if (res.status && Array.isArray(res.price)) {
        this.price = res.price;
      } else {
        this.price = [];
        console.error('Invalid data format for price', res);
      }
      // console.log('price', this.price);
    });
  }

  getPriceByWeight(
    petWeightId: number,
    petTypeId: number,
    subjectId: number
  ): void {
    this.appointmentService
      .getPriceByWeight(petWeightId, petTypeId, subjectId)
      .subscribe(
        (res: any) => {
          // console.log('API Response:', res);
          if (res.status && Array.isArray(res.price)) {
            this.price = res.price.map((price: any) => ({
              id: price.id,
              value: price.value,
              animalsTypes: price.animalsTypeId,
              weight: price.petWeightId,
              price: price.price,
            }));
            if (this.price.length > 0) {
              this.priceValue = this.price[0].price;
            }
            console.log('price', this.price);
          } else {
            this.priceValue = null;
          }
        },
        (error) => {
          console.error('Error fetching pets:', error);
          this.priceValue = null;
        }
      );
  }

  onDateSelected(date: Date) {
    const formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy');
    if (formattedDate) {
      this.getTimeByDate(formattedDate);
    }
  }

  getTimeByDate(date: string) {
    this.appointmentService.getTimeByDate(date).subscribe(
      (res: any) => {
        console.log('API Response:', res);
        if (res.status && Array.isArray(res.times)) {
          this.petsByUser = res.times.map((time: any) => ({
            id: time.id,
            time: time.time,
            is_active: time.is_active,
          }));
          console.log('petsByUser', this.petsByUser);
        } else {
          this.petsByUser = [];
          console.error('Invalid data format for petsByUser', res);
        }
      },
      (error) => {
        console.error('Error fetching times:', error);
      }
    );
  }

  onSubjectSelected() {
    const selectedPet = this.appointmentForm.get('selectedPet')?.value;
    const selectedSubject = this.appointmentForm.get('selectedSubject')?.value;

    if (selectedPet && selectedSubject) {
      const weightId = selectedPet.weight;
      const animalTypeId = selectedPet.animalsTypes;
      const subjectId = selectedSubject.id;

      this.getPriceByWeight(weightId, animalTypeId, subjectId);
    }
  }

  getWeight(petWeightId: number): void {
    console.log('petWeightId petWeightId:', petWeightId);
    this.appointmentService.getWeight(petWeightId).subscribe(
      (res: any) => {
        // console.log('API Response petWeightId:', res);
        if (res.status && Array.isArray(res.weight)) {
          console.log('res.weight:', res.weight);
          this.weight = res.weight.map((weight: any) => ({
            // id: weight.id,
            // value: pet.id,
            // animalsTypes: pet.animalsTypeId,
            weight: weight.weight,
          }));
        } else {
          this.weight = [];
          console.error('Invalid data format for pets', res);
        }
        console.log('weight for pet:', this.weight[0].weight);
      },
      (error) => {
        console.error('Error fetching pets:', error);
      }
    );
  }

  getPets(userId: number): void {
    console.log('getPets userId:', userId);
    this.appointmentService.getPetsByUserId(userId).subscribe(
      (res: any) => {
        // console.log('API Response:', res);
        if (res.status && Array.isArray(res.pets)) {
          this.pets = res.pets.map((pet: any) => ({
            name: pet.name,
            value: pet.id,
            animalsTypes: pet.animalsTypeId,
            weight: pet.petWeightId,
          }));
        } else {
          this.pets = [];
          console.error('Invalid data format for pets', res);
        }
        console.log('Pets for user:', this.pets);
      },
      (error) => {
        console.error('Error fetching pets:', error);
      }
    );
  }

  onAnimalTypeChange() {
    if (this.selectedAnimalsTypes) {
      this.weight = this.allWeight.filter(
        (item) => item.animalTypeId === this.selectedAnimalsTypes.id
      );
    } else {
      this.weight = [];
    }
  }

  getAllWeight() {
    this.appointmentService.getAllWeight().subscribe((res: any) => {
      if (res.status && Array.isArray(res.weight)) {
        this.allWeight = res.weight;
      } else {
        console.error('Invalid weight data', res);
      }
    });
  }

  closeAddPet() {
    this.addPet = false;
    this.petForm.reset();
  }

  openNew() {}

  deleteSelectedProducts() {}

  editProduct() {}

  deleteProduct() {}

  hideDialog() {}

  saveProduct() {}

  findIndexById(id: string): number {
    let index = -1;
    return index;
  }

  createId(): string {
    let id = '';
    var chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  showDialogAddUser() {
    console.log('dialog add user');
    this.addUser = true;
  }

  showDialogAddSubject() {
    console.log('dialog add subject');
    this.addSubject = true;
  }

  closeAddUser(): void {
    this.addUser = false;
  }

  closeAddSubject(): void {
    this.addSubject = false;
  }

  saveUser(): void {
    if (this.userForm.valid) {
      let loggedInUserId: number | null = null;

      if (this.userData) {
        console.log('User data:', this.userData);
        try {
          const parsedUser = JSON.parse(this.userData);

          if (parsedUser?.user?.id) {
            loggedInUserId = parsedUser.user.id;
            console.log('Logged in user ID:', loggedInUserId);
          } else {
            console.error('User ID not found in parsed data');
            alert('ไม่พบข้อมูลผู้ใช้ที่ล็อกอิน');
            return;
          }
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
          alert('เกิดข้อผิดพลาดในการอ่านข้อมูลผู้ใช้');
          return;
        }
      }

      const userFormData = {
        ...this.userForm.value,
        createBy: loggedInUserId,
      };

      console.log('User form with createBy:', userFormData);

      this.appointmentService.saveUser(userFormData).subscribe({
        next: (response) => {
          console.log('User saved successfully!', response);
          alert('บันทึกข้อมูลสำเร็จ');
          this.userForm.reset();
          this.addUser = false;
        },
        error: (err) => {
          console.error('Error saving user:', err);
          alert('เกิดข้อผิดพลาดในการบันทึก');
        },
      });
    } else {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    }
  }

  savePet(): void {
    if (this.petForm.valid) {
      let loggedInUserId: number | null = null;

      if (this.userData) {
        console.log('User data:', this.userData);
        try {
          const parsedUser = JSON.parse(this.userData);

          if (parsedUser?.user?.id) {
            loggedInUserId = parsedUser.user.id;
            console.log('Logged in user ID:', loggedInUserId);
          } else {
            console.error('User ID not found in parsed data');
            alert('ไม่พบข้อมูลผู้ใช้ที่ล็อกอิน');
            return;
          }
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
          alert('เกิดข้อผิดพลาดในการอ่านข้อมูลผู้ใช้');
          return;
        }
      }

      const petFormData = {
        name: this.petForm.value.name,
        userId: this.petForm.value.userId[0].id,
        animalsTypeId: this.petForm.value.type.id,
        petBreeds: this.petForm.value.breed,
        petAge: this.petForm.value.age,
        petWeightId: this.petForm.value.weight.id,
        createBy: loggedInUserId,
      };

      console.log('Transformed Pet form data:', petFormData);

      this.appointmentService.savePets(petFormData).subscribe({
        next: (response) => {
          console.log('Pet saved successfully!', response);
          alert('บันทึกข้อมูลสัตว์เลี้ยงสำเร็จ');
          this.petForm.reset();
          this.addPet = false;
        },
        error: (err) => {
          console.error('Error saving pet:', err);
          alert('เกิดข้อผิดพลาดในการบันทึกสัตว์เลี้ยง');
        },
      });
    } else {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    }
  }

  showDialogAddAppoinment() {
    console.log('dialog add appoinment');
    this.addAppoinment = true;
  }

  showDialogChangeAnimalTypes() {
    console.log('dialog change animalTypes');
    this.changeAnimalTypes = true;
  }

  showDialogAddPet() {
    console.log('dialog add pet');
    this.addPet = true;
  }

  closeAddAppoinment(): void {
    this.addAppoinment = false;
  }

  closeChangeAnimalType(): void {
    this.changeAnimalTypes = false;
  }

  saveAppoinment(): void {
    const formData = this.appointmentForm.value;
    const payload = {
      userId: this.user,
      subject: formData.selectedSubject?.id || null,
      animalsType: formData.selectedPet?.animalsTypes || null,
      animalsBreed: formData.selectedPet?.breed || null,
      animalsName: formData.selectedPet?.name || null,
      timeAppointment: this.combineDateTime(
        formData.selectedDate,
        formData.selectedTimeSlot?.time
      ),
      createBy: this.user,
    };

    this.appointmentService.createAppointment(payload).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'สำเร็จ',
          detail: 'จองสำเร็จ',
        });
        this.appointmentForm.reset();
        this.addAppoinment = false;
        window.location.reload();
      },
      error: (err) => {
        const errorMessage =
          err?.error?.message || 'เกิดข้อผิดพลาดในการจอง กรุณาลองใหม่อีกครั้ง';

        this.messageService.add({
          severity: 'error',
          summary: 'ผิดพลาด',
          detail: errorMessage,
        });
      },
    });
  }

  private combineDateTime(date: Date, time: string): string {
    const [hours, minutes] = time.split(':');
    const newDate = new Date(date);
    newDate.setHours(Number(hours), Number(minutes), 0);
    return newDate.toISOString();
  }

  onWeightChange(event: any) {
    console.log('Selected Weight ID:', event.value.id);
  }

  getAvailableTimeSlots(selectedDate: string) {
    // this.http.get(`/api/available-time-slots?date=${selectedDate}`)
    //   .subscribe((slots: any) => {
    //     this.availableTimeSlots = slots;
    //   });
  }

  getSubjects() {
    this.appointmentService.getSubject().subscribe((res: any) => {
      if (res.status && Array.isArray(res.subjects)) {
        this.subject = res.subjects;
        this.filteredSubjects = [...this.subject];
      } else {
        this.subject = [];
        console.error('Invalid data format for subject', res);
      }
      // console.log('subject', this.subject);
    });
  }

  getAppointment(userId: number) {
    this.appointmentService.getAppointment(userId).subscribe((res: any) => {
      console.log('getAppointment: ', res);
      if (res.status && Array.isArray(res.appointments)) {
        this.data = res.appointments;
      } else {
        this.data = [];
        console.error('Invalid data format for appointment', res);
      }
    });
  }

  saveSubjct() {
    console.log('saveSubjct', this.subjectForm.value);
    if (this.subjectForm.valid) {
      let loggedInUserId: number | null = null;

      if (this.userData) {
        console.log('User data:', this.userData);
        try {
          const parsedUser = JSON.parse(this.userData);

          if (parsedUser?.user?.id) {
            loggedInUserId = parsedUser.user.id;
            console.log('Logged in user ID:', loggedInUserId);
          } else {
            console.error('User ID not found in parsed data');
            alert('ไม่พบข้อมูลผู้ใช้ที่ล็อกอิน');
            return;
          }
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
          alert('เกิดข้อผิดพลาดในการอ่านข้อมูลผู้ใช้');
          return;
        }
      }

      const subjectFormData = {
        subject: this.subjectForm.value.subject,
        createBy: loggedInUserId,
        isDelete: '0',
      };

      console.log('Subject form with createBy:', subjectFormData);

      this.appointmentService.saveSubjects(subjectFormData).subscribe({
        next: (response) => {
          console.log('Subject saved successfully!', response);
          alert('บันทึกข้อมูลสำเร็จ');
          this.subjectForm.reset();
          this.addSubject = false;
          window.location.reload();
        },
        error: (err) => {
          console.error('Error saving subject:', err);
          alert('เกิดข้อผิดพลาดในการบันทึก');
        },
      });
    }
  }

  editAnimalTypes() {
    console.log('editAnimalTypes');
    this.changeAnimalTypes = false;
  }

  deleteAnimalType(id: number): void {
    this.confirmationService.confirm({
      message: 'คุณต้องการลบประเภทสัตว์เลี้ยงนี้หรือไม่?',
      header: 'ยืนยันการลบ',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'ลบ',
      rejectLabel: 'ยกเลิก',
      accept: () => {
        this.animalsTypes = this.animalsTypes.filter((type) => type.id !== id);
        this.appointmentService.removeAnimalTypes(id).subscribe(
          () => {},
          (error) => {
            console.error('Error deleting animal type', error);
          }
        );
      },
    });
  }

  openManagePet() {
    this.router.navigate(['/manage-pet']);
  }

  openManageUser() {
    this.router.navigate(['/manage-user']);
  }

  updateStatus(appointmentId: number, status: number) {
    console.log('updateStatus', appointmentId, status);
    this.appointmentService
      .updateStatus(appointmentId, status.toString())
      .subscribe({
        next: (res) => {
          console.log('อัปเดตสำเร็จ', res);
          window.location.reload();
        },
        error: (err) => {
          console.error('อัปเดตล้มเหลว', err);
        },
      });
  }

  updateStatusWithConfirm(appointmentId: number, status: number) {
    console.log('updateStatusWithConfirm', appointmentId, status);
    const actionText = status === 1 ? 'ยืนยันการจอง' : 'ยกเลิกการจอง';

    this.confirmationService.confirm({
      message: `คุณต้องการ ${actionText} ใช่หรือไม่?`,
      header: 'ยืนยันการทำรายการ',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.updateStatus(appointmentId, status);
      },
      reject: () => {
        console.log('ยกเลิกการทำรายการ');
      },
    });
  }
}

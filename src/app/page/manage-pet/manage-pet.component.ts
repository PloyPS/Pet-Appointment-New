import { Component } from '@angular/core';
import { AppointmentService } from 'src/app/service/appointment/appointment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-pet',
  templateUrl: './manage-pet.component.html',
  styleUrls: ['./manage-pet.component.scss'],
})
export class ManagePetComponent {
  // pets: any;
  changePet: boolean = false;
  petForm: any = {};
  users: any[] = [];
  animalsTypes: any[] = [];
  allWeight: any[] = [];
  pets: any[] = [];

  selectedAnimalsTypes: any;

  oldPetAge: string = '';
  oldPetWeight: string = '';
  selectedWeight: any = null;
  editingPetId!: number;
  originalPetData: any = {};
  // petForm: FormGroup;
  // changePet = false;

  constructor(
    private appointmentService: AppointmentService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getAllPets();
    this.petForm = this.fb.group({
      userId: [{ value: null, disabled: true }],
      name: ['', Validators.required],
      type: [{ value: null, disabled: true }],
      breed: [{ value: null, disabled: true }],
      age: [''],
      weight: [null],
    });
  }

  getAllPets(): void {
    this.appointmentService.getAllPets().subscribe((res: any) => {
      console.log('res', res);
      if (res.status) {
        this.pets = res.pets;
      }
    });
  }

  getAllWeightEdit(animalTypeId: number): void {
    this.appointmentService
      .getAllWeightEdit(animalTypeId)
      .subscribe((res: any) => {
        console.log('res', res);
        if (res.status) {
          this.allWeight = Object.values(res.weight);
        }
      });
  }

  async editPet(pet: any) {
    if (!this.allWeight || this.allWeight.length === 0) {
      await this.getAllWeightEdit(pet.at_id);
    }
    this.editingPetId = pet.p_id;
    this.oldPetAge = pet.p_petAge;
    this.oldPetWeight = pet.w_weight;
    this.originalPetData = {
      age: pet.age,
      weight_id: pet.weight_id,
    };

    this.petForm.patchValue({
      userId: pet.u_firstname,
      name: pet.p_name,
      type: pet.at_name,
      breed: pet.p_petBreeds,
      age: '',
      weight: null,
    });

    this.changePet = true;
  }

  openEditPet() {
    this.changePet = true;
  }

  onAnimalTypeChange(event: any) {
    this.selectedAnimalsTypes = event.value;
    console.log('selectedAnimalsTypes', this.selectedAnimalsTypes);
  }

  closeAddPet() {
    this.changePet = false;
    this.petForm.reset();
  }

saveEditPet() {
  if (this.petForm.invalid) return;

  const updatedData: any = {};
  const currentAge = this.petForm.get('age')?.value;
  const currentWeightId = this.petForm.get('weight')?.value?.id;

  if (currentAge !== this.originalPetData.age) {
    updatedData.petAge = currentAge;
  }

  if (currentWeightId !== this.originalPetData.weight_id) {
    updatedData.petWeightId = currentWeightId;
  }

  if (Object.keys(updatedData).length === 0) {
    Swal.fire({
      icon: 'info',
      title: 'ไม่มีการเปลี่ยนแปลง',
      text: 'คุณยังไม่ได้แก้ไขข้อมูล',
    });
    return;
  }

  this.appointmentService.editPet(updatedData, this.editingPetId).subscribe(
    (res: any) => {
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ',
        text: 'อัปเดตข้อมูลสัตว์เลี้ยงแล้ว',
        timer: 1500,
        showConfirmButton: false,
      });
      this.changePet = false;
      this.getAllPets();
    },
    (err) => {
      Swal.fire({
        icon: 'error',
        title: 'ล้มเหลว',
        text: 'ไม่สามารถอัปเดตได้',
      });
    }
  );
}


  onWeightChange(event: any) {
    this.selectedWeight = event.value;
    console.log('selectedWeight', this.selectedWeight);
  }

  removePet(petId: number) {
    console.log('Pet ID ที่จะลบ:', petId);
    if (!petId) {
      console.error('ไม่มี petId');
      return;
    }
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'คุณต้องการลบสัตว์เลี้ยงนี้ใช่หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        this.appointmentService.removePet(petId).subscribe(
          () => {
            Swal.fire({
              icon: 'success',
              title: 'ลบข้อมูลสำเร็จ',
              text: 'สัตว์เลี้ยงถูกลบเรียบร้อยแล้ว',
            }).then(() => {
              this.getAllPets();
            });
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'เกิดข้อผิดพลาด',
              text: 'ไม่สามารถลบสัตว์เลี้ยงได้',
            });
          }
        );
      }
    });
  }
}

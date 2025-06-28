import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePetComponent } from './manage-pet.component';

describe('ManagePetComponent', () => {
  let component: ManagePetComponent;
  let fixture: ComponentFixture<ManagePetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagePetComponent]
    });
    fixture = TestBed.createComponent(ManagePetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

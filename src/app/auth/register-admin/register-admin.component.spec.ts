import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAdminComponent } from './register-admin.component';

describe('RegisterComponent', () => {
  let component: RegisterAdminComponent;
  let fixture: ComponentFixture<RegisterAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

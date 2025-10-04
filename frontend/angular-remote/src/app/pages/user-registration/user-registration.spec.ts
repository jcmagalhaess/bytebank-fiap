import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRegistration } from './user-registration';

describe('UserRegistration', () => {
  let component: UserRegistration;
  let fixture: ComponentFixture<UserRegistration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRegistration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRegistration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

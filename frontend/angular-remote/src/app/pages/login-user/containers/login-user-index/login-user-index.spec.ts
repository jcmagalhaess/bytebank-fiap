import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginUserIndex } from './login-user-index';

describe('LoginUserIndex', () => {
  let component: LoginUserIndex;
  let fixture: ComponentFixture<LoginUserIndex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginUserIndex]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginUserIndex);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

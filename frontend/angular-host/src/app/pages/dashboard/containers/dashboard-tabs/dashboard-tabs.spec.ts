import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTabs } from './dashboard-tabs';

describe('DashboardTabs', () => {
  let component: DashboardTabs;
  let fixture: ComponentFixture<DashboardTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTabs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardTabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsForm } from './transactions-form';

describe('TransactionsForm', () => {
  let component: TransactionsForm;
  let fixture: ComponentFixture<TransactionsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

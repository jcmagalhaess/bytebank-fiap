import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsTable } from './transactions-table';

describe('TransactionsTable', () => {
  let component: TransactionsTable;
  let fixture: ComponentFixture<TransactionsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

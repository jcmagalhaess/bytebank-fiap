import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsPreview } from './transactions-preview';

describe('TransactionsPreview', () => {
  let component: TransactionsPreview;
  let fixture: ComponentFixture<TransactionsPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsPreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionsPreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

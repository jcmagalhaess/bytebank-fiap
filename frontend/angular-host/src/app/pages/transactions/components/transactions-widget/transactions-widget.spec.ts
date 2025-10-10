import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsWidget } from './transactions-widget';

describe('TransactionsWidget', () => {
  let component: TransactionsWidget;
  let fixture: ComponentFixture<TransactionsWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionsWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

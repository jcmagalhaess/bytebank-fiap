import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisCard } from './analysis-card';

describe('AnalysisCard', () => {
  let component: AnalysisCard;
  let fixture: ComponentFixture<AnalysisCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

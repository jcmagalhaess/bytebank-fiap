import { Component } from '@angular/core';
import { AnalysisCard } from '../../../../shared/components/analysis-card/analysis-card';

@Component({
  selector: 'app-dashboard',
  imports: [AnalysisCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}

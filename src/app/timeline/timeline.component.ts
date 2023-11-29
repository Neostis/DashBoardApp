import { Component } from '@angular/core';
import { GanttChartComponent } from '../gantt-chart/gantt-chart.component';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  standalone: true,
  imports: [GanttChartComponent],
})
export class TimelineComponent {
  constructor() {}
}

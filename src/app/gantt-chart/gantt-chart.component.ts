import { Component, OnInit, ViewChild } from '@angular/core';
import { GanttChartTaskColumn } from 'smart-webcomponents-angular/ganttchart';

import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GanttChartModule } from 'smart-webcomponents-angular/ganttchart';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.scss'],
  standalone: true,
  imports: [CommonModule, GanttChartModule, RouterOutlet, IonicModule],
})
export class GanttChartComponent implements OnInit {
  ganttchart: any;
  constructor() {}

  ngOnInit(): void {
    this.ganttchart = document.querySelector('smart-gantt-chart');
  }

  taskColumns: GanttChartTaskColumn[] = [
    {
      label: 'Tasks',
      value: 'label',
      size: '100%',
    },
    // {
    //   label: 'Duration (hours)',
    //   value: 'duration',
    //   formatFunction: (date: string) => parseInt(date),
    // },
  ];

  dataSource = [
    {
      label: 'PRD & User-Stories',
      dateStart: '2024-01-10',
      dateEnd: '2024-02-10',
      class: 'product-team',
      type: 'task',
    },
    {
      label: 'Persona & Journey',
      dateStart: '2024-02-11',
      dateEnd: '2024-03-10',
      class: 'marketing-team',
      type: 'task',
    },
    {
      label: 'Architecture',
      dateStart: '2024-03-11',
      dateEnd: '2024-04-1',
      class: 'product-team',
      type: 'task',
    },
    {
      label: 'Prototyping',
      dateStart: '2024-04-02',
      dateEnd: '2024-05-01',
      class: 'dev-team',
      type: 'task',
    },
    {
      label: 'Design',
      dateStart: '2024-05-02',
      dateEnd: '2024-06-31',
      class: 'design-team',
      type: 'task',
    },
    {
      label: 'Development',
      dateStart: '2024-07-01',
      dateEnd: '2024-08-10',
      class: 'dev-team',
      type: 'task',
    },
    {
      label: 'Testing & QA',
      dateStart: '2024-08-11',
      dateEnd: '2024-09-10',
      class: 'qa-team',
      type: 'task',
    },
    {
      label: 'UAT Test',
      dateStart: '2024-09-12',
      dateEnd: '2024-10-01',
      class: 'product-team',
      type: 'task',
    },
    {
      label: 'Handover & Documentation',
      dateStart: '2024-10-02',
      dateEnd: '2024-11-01',
      class: 'marketing-team',
      type: 'task',
    },
    {
      label: 'Release',
      dateStart: '2024-11-01',
      dateEnd: '2024-12-31',
      class: 'release-team',
      type: 'task',
    },
  ];

  addTask() {
    const newTask = {
      label: 'New',
      dateStart: '2024-11-01',
      dateEnd: '2024-12-31',
      class: 'new',
      type: 'task',
    };

    this.ganttchart?.insertTask(newTask);
    console.log(this.ganttchart?.tasks);
  }
}

import { Component, OnInit } from '@angular/core';
import { GanttChartTaskColumn } from 'smart-webcomponents-angular/ganttchart';

import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GanttChartModule } from 'smart-webcomponents-angular/ganttchart';
import { IonicModule } from '@ionic/angular';
import { MongoDBService } from '../services/mongoDB.service';
import { SharedService } from '../services/shared.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    GanttChartModule,
    RouterOutlet,
    IonicModule,
    HttpClientModule,
  ],
  providers: [MongoDBService],
})
export class TimelineComponent implements OnInit {
  ganttchart: any;

  projectList: any[] = [];
  taskList: any[] = [];

  _ProjectId!: string;

  dataSource: any[] = [];

  taskColumns: GanttChartTaskColumn[] = [
    {
      label: 'Tasks',
      value: 'label',
      size: '50%',
    },
    {
      label: 'Date Start',
      value: 'dateStart',
      size: '35%',
      formatFunction: (dateString: string) => {
        const date = new Date(dateString),
          formatNumber = (number: number) => ('0' + number).slice(-2);

        return (
          date.getFullYear() +
          '-' +
          formatNumber(date.getMonth() + 1) +
          '-' +
          formatNumber(date.getDate())
        );
      },
      //Custom format function
    },
    {
      label: 'Date End',
      value: 'dateEnd',
      size: '25 %',
      formatFunction: (dateString: string) => {
        const date = new Date(dateString),
          formatNumber = (number: number) => ('0' + number).slice(-2);

        return (
          date.getFullYear() +
          '-' +
          formatNumber(date.getMonth() + 1) +
          '-' +
          formatNumber(date.getDate())
        );
      },
    },
  ];

  constructor(
    private mongoDBService: MongoDBService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.ganttchart = document.querySelector('smart-gantt-chart');
    this.ganttchart.addEventListener('itemUpdate', (event: any) => {
      const thisItem = this.ganttchart.getState().tasks[event.detail.id];
      const data = {
        label: thisItem.label,
        taskId: thisItem.taskId,
        projectId: thisItem.projectId,
        connections: thisItem.connections ? thisItem.connections : [],
        dateStart: thisItem.dateStart,
        dateEnd: thisItem.dateEnd,
        type: thisItem.type,
        _id: thisItem._id,
      };
      console.log(data);
    });

    this.ganttchart.addEventListener('resizeEnd', (event: any) => {
      const thisItem = this.ganttchart.getState().tasks[event.detail.id];
      const data = {
        label: thisItem.label,
        taskId: thisItem.taskId,
        projectId: thisItem.projectId,
        connections: thisItem.connections ? thisItem.connections : [],
        dateStart: thisItem.dateStart,
        dateEnd: thisItem.dateEnd,
        type: thisItem.type,
        _id: thisItem._id,
      };
    });

    this.loadProject();
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  test() {
    console.log(this.ganttchart.getState().tasks);
  }

  updateTimeline() {}

  fetchTimelineByProjectId() {
    this.mongoDBService.getTimelineByProjectId(this._ProjectId).subscribe({
      next: (response) => {
        this.dataSource = response;
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
      },
      complete: () => {
        console.log('Data:', this.dataSource);
      },
    });
  }

  private loadProject(): void {
    this.mongoDBService.getProjects().subscribe({
      next: (response) => {
        this.projectList = response;

        this.sharedService.updateProjectVariable(this.projectList[0]);
      },
      error: (error) => {
        console.error('Error retrieving files:', error);
      },
      complete: () => {
        this._ProjectId = this.sharedService.useProjectVariable()?._id;
        if (this._ProjectId) {
          this.fetchTimelineByProjectId();
        }
      },
    });
  }
}

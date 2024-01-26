import { Component, OnInit } from '@angular/core';
import { GanttChartTaskColumn } from 'smart-webcomponents-angular/ganttchart';

import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GanttChartModule } from 'smart-webcomponents-angular/ganttchart';
import { IonicModule } from '@ionic/angular';
import { MongoDBService } from '../../services/mongoDB.service';
import { SharedService } from '../../services/shared.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.page.html',
  styleUrls: ['./timeline.page.scss'],
  standalone: true,
  imports: [CommonModule, GanttChartModule, RouterOutlet, IonicModule],
})
export class TimelinePage implements OnInit {
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
    private storeService: StorageService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    if (this._ProjectId) {
      this.fetchTimelineByProjectId();
    }

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
  }

  ionViewWillEnter() {
    this.storeService.get('currentProject').then((data) => {
      if (data) {
        this._ProjectId = data.value;
        if (this._ProjectId) {
          this.fetchTimelineByProjectId();
        }
      }
    });
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
}

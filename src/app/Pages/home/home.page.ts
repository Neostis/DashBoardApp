import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MongoDBService } from 'src/app/services/mongoDB.service';
import { SharedService } from 'src/app/services/shared.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class HomePage implements OnInit {
  protected options: any[] = [];
  protected currentProject: any;
  protected selected: any;

  constructor(
    private mongoDBService: MongoDBService,
    private storeService: StorageService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    // const rawData = localStorage.getItem('currentProject');
    // const parseData = rawData ? JSON.parse(rawData) : null;
    // if (parseData && parseData.value) {
    //   this.currentProject = parseData.label;
    // }

    this.loadProject();
  }

  ionViewWillEnter() {
    this.loadProject();
    this.storeService.get('currentProject').then((data) => {
      if (data) {
        this.currentProject = data.label;
      }
    });
  }

  private loadProject(): void {
    this.mongoDBService.getProjects().subscribe({
      next: (response) => {
        this.options = response.map(({ _id, title }) => ({
          value: _id,
          label: title,
          usage: true,
        }));
      },
      error: (error) => {
        console.error('Error:', error);
      },
      complete: () => {},
    });
  }

  protected onSelection(e: any) {
    if (e.detail.value) {
      const project = this.options.find((o) => o.value === e.detail.value);
      this.storeService.set('currentProject', project);
      window.location.reload();
      // localStorage.setItem('currentProject', JSON.stringify(project));
    }
    // window.location.reload();
  }

  protected onCancel() {}

  protected onDismiss() {}
}

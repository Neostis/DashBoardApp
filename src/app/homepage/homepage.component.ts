import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ProjectModel } from '../model/project.model';
import { HttpClientModule } from '@angular/common/http';
import { MongoDBService } from '../services/mongoDB.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  imports: [IonicModule, HttpClientModule],
  providers: [MongoDBService],
})
export class HomepageComponent implements OnInit {
  options: any[] = [];
  currentProject: any;
  constructor(
    private mongoDBService: MongoDBService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    const rawData = localStorage.getItem('currentProject');
    const parseData = rawData ? JSON.parse(rawData) : null;
    if (parseData && parseData.value) {
      this.currentProject = parseData.label;
    }
    this.loadProject();
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

  onSelection(e: any) {
    const project = this.options.find((o) => o.value === e.detail.value);
    localStorage.setItem('currentProject', JSON.stringify(project));
    window.location.reload();
  }
  onCancel() {}

  onDismiss() {}
}

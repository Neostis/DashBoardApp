import { Component, HostListener, OnInit } from '@angular/core';
import { MongoDBService } from '../services/mongoDB.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-filesManager-container',
  templateUrl: './filesManager.component.html',
  styleUrls: ['./filesManager.component.scss'],
  // styleUrl: './files.component.scss',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
  providers: [MongoDBService],
})
export class FilesManagerContainerComponent implements OnInit {
  // @Input() name?: string;
  constructor(
    private sharedService: SharedService,
    private mongoDBService: MongoDBService
  ) {}
  fileList: any[] = this.sharedService.FilesDatabase;
  protected filteredFiles: any

  ngOnInit(): void {
    
    if (this.sharedService.useGlobalVariable() == undefined) {
      this.loadFiles();
    }
  }

  loadFiles(): void {
    this.mongoDBService.getFiles().subscribe({
      next: (response) => {
        // Assuming your response has a 'data' property with the files
        this.fileList = response;

        // Sort fileList by metadata.lastModified (assuming it's in Unix timestamp) in descending order
        this.fileList.sort(
          (a, b) => b.metadata.lastModified - a.metadata.lastModified
        );
        this.sharedService.updateGlobalVariable(this.fileList);
        this.filteredFiles = this.fileList
        console.log(this.fileList);

      },
      error: (error) => {
        console.error('Error retrieving files:', error);
        // Handle error
      },
      complete: () => {
        // Handle completion if needed
      },
    });
  }

  getOriginalName(filename: string): string {
    return filename.replace(/\.[^.]+$/, '');
  }

  formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';
  
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
    const i = Math.floor(Math.log(bytes) / Math.log(k));
  
    const formattedBytes = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
    const unit = sizes[i];
  
    return `${formattedBytes} ${unit}`;
  }
  

  handleInput(event: any) {
    const query = event.target.value.toLowerCase();

    this.filteredFiles = this.fileList.filter(
      (d) => d.filename.toLowerCase().indexOf(query) > -1
    );
  }

  deleteItem(item: any): void {
    // Handle item deletion logic here
    const index = this.fileList.indexOf(item);
    if (index !== -1) {
      this.fileList.splice(index, 1);
    }
  }

}

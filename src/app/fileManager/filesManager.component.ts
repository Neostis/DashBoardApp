import { Component, HostListener, OnInit } from '@angular/core';
import { MongoDBService } from '../services/mongoDB.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { SharedService } from '../services/shared.service';
import { AlertController } from '@ionic/angular';
import { ToastOptions } from '../interface/toast-options.interface';
import { ToastService } from '../services/toast.service';

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
  constructor(
    private sharedService: SharedService,
    private mongoDBService: MongoDBService,
    private alertController: AlertController,
    private toastService: ToastService
  ) {}
  file: File | null = null;
  fileList: any[] = this.sharedService.useFilesVariable();
  protected filteredFiles: any;

  ngOnInit(): void {
    // if (this.sharedService.useFilesVariable() == undefined) {
    this.loadFiles();
    // }
  }

  private updateFilesVariable(): void {
    this.sharedService.updateFilesVariable(this.fileList);
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
        this.filteredFiles = this.fileList;
        this.updateFilesVariable();
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

  async deleteItem(file: any) {
    console.log(file);

    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete ${file.filename}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Delete cancelled');
          },
        },
        {
          text: 'Delete',
          handler: () => {
            this.confirmDelete(file);
          },
        },
      ],
    });

    await alert.present();
  }

  async confirmDelete(file: any) {
    const fileId = file._id;
    this.mongoDBService.deleteFile(fileId).subscribe({
      next: (response) => {
        const toastOptions: ToastOptions = {
          message: `File deleted successfully`,
          duration: 1500,
          position: 'top',
        };
        this.toastService.presentToast(toastOptions);
        this.loadFiles();
        this.updateFilesVariable();
      },
      error: (error) => {
        if (error.status !== 204) {
          const toastOptions: ToastOptions = {
            message: `Error deleting file`,
            duration: 1500,
            position: 'top',
          };
          this.toastService.presentToast(toastOptions);
        }
      },
    });
  }

  handleFileUpload(event: any): void {
    const uploadFile: FileList = event.target.files;
    this.file = null;

    if (uploadFile.length > 0) {
      this.file = uploadFile[0];

      if (this.file) {
        this.mongoDBService
          .uploadFile(this.file, this.sharedService.useProjectVariable()._id)
          .subscribe({
            next: (response) => {},
            error: (error) => {
              if (error.status == 201) {
                const toastOptions: ToastOptions = {
                  message: `File upload successfully`,
                  duration: 1500,
                  position: 'top',
                };
                this.toastService.presentToast(toastOptions);
                this.loadFiles();
                this.sharedService.updateFilesVariable(this.fileList);
              } else {
                const toastOptions: ToastOptions = {
                  message: `Error uploading file`,
                  duration: 1500,
                  position: 'top',
                };
                this.toastService.presentToast(toastOptions);
              }
            },
            complete: () => {
              // Handle completion if needed
            },
          });
      }
    }
  }
}

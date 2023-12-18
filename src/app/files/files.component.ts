import { ProjectModel } from './../model/project.model';
import { Component, HostListener, OnInit } from '@angular/core';
import { MongoDBService } from '../services/mongoDB.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { ToastOptions } from '../interface/toast-options.interface';
import { ToastService } from '../services/toast.service';
import { SharedService } from '../services/shared.service';
import { FilesModel } from '../model/files.model';

@Component({
  selector: 'app-files-container',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
  // styleUrl: './files.component.scss',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterLink,
  ],
  providers: [MongoDBService],
})
export class FilesContainerComponent implements OnInit {
  constructor(
    private mongoDBService: MongoDBService,
    private toastService: ToastService,
    private sharedService: SharedService
  ) {}
  route: string = '';
  private file: File | null = null;
  private fileList: FilesModel[] = this.sharedService.useFilesVariable();
  filteredFiles: FilesModel[] = this.sharedService.useFilesVariable();
  private projectList: ProjectModel[] = [];

  ngOnInit(): void {
    // if (this.filteredFiles == undefined) {
    this.loadFiles();
    this.loadProject();
    // }
  }

  setRoute(value: string) {
    localStorage.setItem('currentRoute', value.toLowerCase());
    this.route = value.toLowerCase();
  }

  //set Test Project
  private loadProject(): void {
    this.mongoDBService.getProjects().subscribe({
      next: (response) => {
        // Assuming your response has a 'data' property with the files
        this.projectList = response;

        this.sharedService.updateProjectVariable(this.projectList[1]);
        
      },
      error: (error) => {
        console.error('Error retrieving files:', error);
      },
      complete: () => {},
    });
  }

  private loadFiles(): void {
    this.mongoDBService.getFiles().subscribe({
      next: (response) => {
        // Assuming your response has a 'data' property with the files
        this.fileList = response;

        // Sort fileList by metadata.lastModified (assuming it's in Unix timestamp) in descending order
        this.fileList.sort(
          (a, b) => b.metadata.lastModified - a.metadata.lastModified
        );

        this.filteredFiles = [...this.fileList];
        this.sharedService.updateFilesVariable(this.fileList);
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

  handleInput(event: any) {
    const query = event.target.value.toLowerCase();

    this.filteredFiles = this.fileList.filter(
      (d) => d.filename.toLowerCase().indexOf(query) > -1
    );
  }

  /**
   * The getFileIcon function takes a file type as input and returns the corresponding image path for
   * that file type, or a default image path if the file type is not found in the iconMap.
   * @param {string} type - The `type` parameter is a string that represents the file type. It is used to
   * determine the corresponding image path for the file icon.
   * @returns The function `getFileIcon` returns the image path corresponding to the given file type. If
   * the file type is found in the `iconMap` object, the corresponding image path is returned. Otherwise,
   * the default image path 'assets/icon/filesIcon/default.png' is returned.
   */
  getFileIcon(type: string): any {
    // Map file types to image paths
    const iconMap: { [key: string]: string } = {
      '3ds': 'assets/icon/filesIcon/3ds.png',
      aac: 'assets/icon/filesIcon/aac.png',
      ai: 'assets/icon/filesIcon/ai.png',
      avi: 'assets/icon/filesIcon/avi.png',
      bmp: 'assets/icon/filesIcon/bmp.png',
      cad: 'assets/icon/filesIcon/cad.png',
      cdr: 'assets/icon/filesIcon/cdr.png',
      css: 'assets/icon/filesIcon/css.png',
      dat: 'assets/icon/filesIcon/dat.png',
      dll: 'assets/icon/filesIcon/dll.png',
      doc: 'assets/icon/filesIcon/doc.png',
      eps: 'assets/icon/filesIcon/eps.png',
      fla: 'assets/icon/filesIcon/fla.png',
      flv: 'assets/icon/filesIcon/flv.png',
      gif: 'assets/icon/filesIcon/gif.png',
      html: 'assets/icon/filesIcon/html.png',
      indd: 'assets/icon/filesIcon/indd.png',
      iso: 'assets/icon/filesIcon/iso.png',
      jpg: 'assets/icon/filesIcon/jpg.png',
      js: 'assets/icon/filesIcon/js.png',
      midi: 'assets/icon/filesIcon/midi.png',
      mov: 'assets/icon/filesIcon/mov.png',
      mp3: 'assets/icon/filesIcon/mp3.png',
      mpg: 'assets/icon/filesIcon/mpg.png',
      pdf: 'assets/icon/filesIcon/pdf.png',
      php: 'assets/icon/filesIcon/php.png',
      png: 'assets/icon/filesIcon/png.png',
      ppt: 'assets/icon/filesIcon/ppt.png',
      ps: 'assets/icon/filesIcon/ps.png',
      psd: 'assets/icon/filesIcon/psd.png',
      raw: 'assets/icon/filesIcon/raw.png',
      sql: 'assets/icon/filesIcon/sql.png',
      svg: 'assets/icon/filesIcon/svg.png',
      tif: 'assets/icon/filesIcon/tif.png',
      txt: 'assets/icon/filesIcon/txt.png',
      wmv: 'assets/icon/filesIcon/wmv.png',
      xls: 'assets/icon/filesIcon/xls.png',
      xml: 'assets/icon/filesIcon/xml.png',
      zip: 'assets/icon/filesIcon/zip.png',
    };
    return iconMap[type] || 'assets/icon/filesIcon/default.png';
  }

  /**
   * The function `getTimeAgo` takes a `lastModified` date and returns a string representing the time
   * difference between the current date and the `lastModified` date in a human-readable format.
   * @param {Date | null} lastModified - The `lastModified` parameter is a `Date` object that represents
   * the date and time when something was last modified. It can be either a valid `Date` object or `null`
   * if the last modified date is unknown or not applicable.
   * @returns a string representing the time elapsed since the last modified date. If the `lastModified`
   * parameter is `null`, an empty string is returned. Otherwise, the function calculates the time
   * difference in seconds between the current date and the `lastModified` date. Based on the time
   * difference, the function returns a string in the format of "x seconds/minutes/hours/days/weeks
   */
  getTimeAgo(lastModified: number | null): string {
    if (!lastModified) {
      return ''; // or any default value you prefer
    }

    const currentDate = new Date();
    const lastModifiedDate = new Date(lastModified);
    const differenceInSeconds = Math.floor(
      (currentDate.getTime() - lastModifiedDate.getTime()) / 1000
    );

    if (differenceInSeconds < 5) {
      return 'just now';
    } else if (differenceInSeconds < 60) {
      return `${differenceInSeconds} second${
        differenceInSeconds === 1 ? '' : 's'
      } ago`;
    } else if (differenceInSeconds < 3600) {
      const minutes = Math.floor(differenceInSeconds / 60);
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else if (differenceInSeconds < 86400) {
      const hours = Math.floor(differenceInSeconds / 3600);
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else if (differenceInSeconds < 604800) {
      const days = Math.floor(differenceInSeconds / 86400);
      return `${days} day${days === 1 ? '' : 's'} ago`;
    } else if (differenceInSeconds < 2419200) {
      const weeks = Math.floor(differenceInSeconds / 604800);
      return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
    } else if (differenceInSeconds < 29030400) {
      const months = Math.floor(differenceInSeconds / 2419200);
      return `${months} month${months === 1 ? '' : 's'} ago`;
    } else {
      const years = Math.floor(differenceInSeconds / 29030400);
      return `${years} year${years === 1 ? '' : 's'} ago`;
    }
  }

  getOriginalName(filename: string): string {
    return filename.replace(/\.[^.]+$/, '');
  }

  @HostListener('dragover', ['$event']) onDragOver(event: any): void {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: any): void {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('drop', ['$event']) onDrop(event: any): void {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;
    this.handleFiles(files);
  }

  /**
   * The function "handleFiles" takes a list of files as input, clears any existing file, and assigns the
   * first file from the list to a variable.
   * @param {FileList} files - The parameter `files` is of type `FileList`, which is a list-like object
   * that contains a collection of `File` objects. It represents the files selected by the user in a file
   * input field.
   */
  private handleFiles(uploadFile: FileList): void {
    // Clear existing file
    this.file = null;

    // Only add the first file from the list
    if (uploadFile.length > 0) {
      this.file = uploadFile[0];
      console.log(this.file);

      if (this.file) {
        this.mongoDBService
          .uploadFile(this.file, this.sharedService.useProjectVariable()._id)
          .subscribe({
            next: (response) => {
              // Call the presentToast function
              const toastOptions: ToastOptions = {
                message: `File uploaded successfully`,
                duration: 1500,
                position: 'top',
              };
              this.toastService.presentToast(toastOptions);

              this.loadFiles();
              this.sharedService.updateFilesVariable(this.fileList);
            },
            error: (error) => {
              // Handle error
              const toastOptions: ToastOptions = {
                message: `Error uploading file`,
                duration: 1500,
                position: 'top',
              };
              this.toastService.presentToast(toastOptions);
            },
            complete: () => {
              // Handle completion if needed
            },
          });
      }
    }
  }

  openFileInNewTab(file: any): void {
    this.mongoDBService.getFileContent(file._id).subscribe(
      (fileContent) => {
        const blob = new Blob([fileContent], { type: file.contentType });
        const url = URL.createObjectURL(blob);

        // Open a new tab with the file content
        window.open(url, '_blank');
      },
      (error) => {
        console.error('Error getting file content:', error);
        // Handle error
      }
    );
  }

  getProjectName(): string {
    return this.sharedService.useProjectVariable()?.title || '?';
  }

  getProjectID(): string {
    return this.sharedService.useProjectVariable()?._id || '?';
  }
}

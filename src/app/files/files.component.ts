import { Component, HostListener  } from '@angular/core';

@Component({
  selector: 'app-files-container',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
  standalone: true,
})
export class FilesContainerComponent {
  // @Input() name?: string;

  getRandomDate(): Date {
    const startDate = new Date(2023, 0, 1); // January 1, 2022
    const endDate = new Date(); // Current date

    const randomTimestamp = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
    return new Date(randomTimestamp);
  }
  onFileSelected(files: FileList | null): void {
    if (files && files.length > 0) {
      // Do something with the selected file(s)
      // console.log(files[0].name);
    }
  }

  filesTest = [
    { name: 'a', type: '3ds', lastModified: this.getRandomDate() },
    { name: 'b', type: 'pdf', lastModified: this.getRandomDate()  },
    { name: 'c', type: 'ai', lastModified: this.getRandomDate()  },
    { name: 'd', type: 'css', lastModified: this.getRandomDate()  },
    { name: 'd', type: 'css', lastModified: this.getRandomDate()  },
    // { name: 'd', type: 'css', lastModified: this.getRandomDate()  },
    // { name: 'd', type: 'css', lastModified: this.getRandomDate()  },
    // { name: 'd', type: 'css', lastModified: this.getRandomDate()  },
    // { name: 'd', type: 'css', lastModified: this.getRandomDate()  },

  ];

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

  getTimeAgo(lastModified: Date | null): string {
    if (!lastModified) {
      return ''; // or any default value you prefer
    }

    const currentDate = new Date();
    const differenceInSeconds = Math.floor((currentDate.getTime() - lastModified.getTime()) / 1000);

    if (differenceInSeconds < 60) {
      return `${differenceInSeconds} second${differenceInSeconds === 1 ? '' : 's'} ago`;
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

  file: File | null = null;

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

    console.log('Dropped file:', this.file);
  }

  handleFiles(files: FileList): void {
    // Clear existing file
    this.file = null;

    // Only add the first file from the list
    if (files.length > 0) {
      this.file = files[0];
    }
  }

  removeFile(): void {
    this.file = null;
  }
}

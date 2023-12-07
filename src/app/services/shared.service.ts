import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  FilesDatabase: any;

  constructor() {}

  updateGlobalVariable(newValue: any): void {
    this.FilesDatabase = newValue;
  }

  useGlobalVariable(): any {
    return this.FilesDatabase
  }
}

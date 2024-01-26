import { Injectable } from '@angular/core';
import { ProjectModel } from '../model/project.model';
import { FilesModel } from '../model/files.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private FilesDatabase!: FilesModel;
  private ProjectDatabase!: ProjectModel;


  constructor(private storeService: StorageService) {}

  public updateFilesVariable(newValue: any): void {
    this.FilesDatabase = newValue;
  }

  public useFilesVariable(): any {
    return this.FilesDatabase;
  }

  public updateProjectVariable(newValue: ProjectModel): void {
    this.ProjectDatabase = newValue;
  }

  public useProjectVariable(): ProjectModel {
    return this.ProjectDatabase;
  }

}

import { Injectable } from '@angular/core';
import { ProjectModel } from '../model/project.model';
import { FilesModel } from '../model/files.model';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private FilesDatabase!: FilesModel;
  private ProjectDatabase!: ProjectModel;

  constructor() {}

  updateFilesVariable(newValue: any): void {
    this.FilesDatabase = newValue;
  }

  useFilesVariable(): any {
    return this.FilesDatabase;
  }

  updateProjectVariable(newValue: ProjectModel): void {
    this.ProjectDatabase = newValue;
  }

  useProjectVariable(): ProjectModel {
    return this.ProjectDatabase;
  }

  getProjectId(): any {
    const rawData = localStorage.getItem('currentProject');
    const parseData = rawData ? JSON.parse(rawData) : null;
    return parseData ? parseData.value : null;
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { IonModal, IonicModule } from '@ionic/angular';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { TaskModel } from '../../model/task.model';
import { MongoDBService } from '../../services/mongoDB.service';
import { SharedService } from '../../services/shared.service';
import { ProjectModel } from '../../model/project.model';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    FormsModule,
  ],
})
export class TasksPage implements OnInit {
  protected form!: FormGroup;
  protected selected: string = 'Select a team member';
  protected tags: string[] = [];
  private selectedDateTime!: string;
  protected taskList: any[] = [];
  protected isModalOpen = false;
  protected projectList: ProjectModel[] = [];
  private _ProjectId!: string;
  protected projectMembers: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private mongoDBService: MongoDBService,
    private storeService: StorageService,
    private sharedService: SharedService
  ) {
    this.form = this.formBuilder.group({
      input1: '',
      input2: '',
      input3: '',
    });
  }

  @ViewChild(IonModal) private modal!: IonModal;

  ngOnInit(): void {
    if (this._ProjectId) {
      this.loadMember();
      this.fetchTasksByProjectId();
    }
  }

  ionViewWillEnter() {
    this.storeService.get('currentProject').then((data) => {
      if (data) {
        this._ProjectId = data.value;
        if (this._ProjectId) {
          this.loadMember();
          this.fetchTasksByProjectId();
        }
      }
    });
  }

  private loadMember(): void {
    this.mongoDBService.getProjectMembers(this._ProjectId).subscribe({
      next: (response) => {
        this.projectMembers = response;
      },
      error: (error) => {
        console.error('Error Message:', error);
      },
      complete: () => {},
    });
  }

  protected cancel() {
    this.clearInputData();
    this.modal.dismiss();
  }

  private clearInputData() {
    this.selectedDateTime = '';
    this.tags = [];
    this.form.reset();
  }

  protected confirm() {
    const newCardData: TaskModel = {
      title: this.form.get('input1')?.value,
      startDate: new Date(),
      endDate: this.selectedDateTime
        ? new Date(this.selectedDateTime)
        : new Date(),
      details: this.form.get('input3')?.value,
      projectId: this._ProjectId,
      status: 'Yet to start',
      tags: this.tags,
      members: this.form.value.input2,
    };

    this.addTask(newCardData);
    this.fetchTasksByProjectId();
    this.clearInputData();
    this.modal.dismiss();
  }

  private refreshTaskData() {
    this.taskList = [];
    this.fetchTasksByProjectId();
  }

  protected onWillDismiss(event: Event) {
    this.isModalOpen = false;
  }

  protected setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  protected onSelectDateTime(event: CustomEvent) {
    this.selectedDateTime = event.detail.value;
  }

  protected addTag(tagValue: string): void {
    if (tagValue.trim() !== '') {
      this.tags.push(tagValue.trim());
    }
  }

  protected removeTag(tagToRemove: string): void {
    this.tags = this.tags.filter((tag) => tag !== tagToRemove);
  }

  private addTask(taskData: TaskModel) {
    this.mongoDBService.addTask(taskData).subscribe({
      next: (response) => {
        console.log('Task added successfully');
      },
      error: (error) => {
        console.error('Error adding task');
      },
      complete: () => {
        this.refreshTaskData();
      },
    });
  }

  private fetchTasksByProjectId() {
    this.mongoDBService.getTasksByProjectId(this._ProjectId).subscribe({
      next: (response) => {
        this.taskList = response;
      },
      error: (error) => {
        console.error('Error fetching tasks');
      },
      complete: () => {},
    });
  }

  private updateTaskStatus(taskId: string, newStatus: string): void {
    this.mongoDBService.updateTaskStatus(taskId, newStatus).subscribe({
      next: (response) => {
        console.log('Task status updated successfully');
      },
      error: (error) => {
        console.error('Error updating task status');
      },
      complete: () => {
        this.refreshTaskData();
      },
    });
  }

  protected selectionChange() {}

  protected handleStatusChange(newStatus: any, taskId: any) {
    this.updateTaskStatus(taskId, newStatus.detail.value);
  }

  protected handleStatusCancel() {}

  protected handleStatusDismiss() {}
}

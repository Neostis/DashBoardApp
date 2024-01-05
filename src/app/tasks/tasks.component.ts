import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { IonModal, IonicModule } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe } from '@angular/common';
import { TaskModel } from '../model/task.model';
import { MongoDBService } from '../services/mongoDB.service';
import { SharedService } from '../services/shared.service';
import { HttpClientModule } from '@angular/common/http';
import { ProjectModel } from '../model/project.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
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
    HttpClientModule,
    FormsModule,
  ],
  providers: [MongoDBService, DatePipe],
})
export class TasksComponent implements OnInit {
  [x: string]: any;
  form!: FormGroup;
  selected: string = 'Select a team member';
  tags: string[] = [];
  selectedDateTime!: string;
  taskList: any[] = [];
  isModalOpen = false;
  projectList: ProjectModel[] = [];
  _ProjectId!: string;
  projectMembers: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private mongoDBService: MongoDBService,
    private sharedService: SharedService
  ) {
    this.form = this.formBuilder.group({
      input1: '',
      input2: '',
      input3: '',
    });
  }

  @ViewChild(IonModal) modal!: IonModal;

  ngOnInit(): void {
    this.loadProject();
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

  private loadProject(): void {
    this.mongoDBService.getProjects().subscribe({
      next: (response) => {
        this.projectList = response;

        this.sharedService.updateProjectVariable(this.projectList[0]);
      },
      error: (error) => {
        console.error('Error retrieving files:', error);
      },
      complete: () => {
        this._ProjectId = this.sharedService.useProjectVariable()?._id;
        this.loadMember();
        if (this._ProjectId) {
          this.fetchTasksByProjectId();
        }
      },
    });
  }

  cancel() {
    this.clearInputData();
    this.modal.dismiss();
  }

  clearInputData() {
    this.selectedDateTime = '';
    this.tags = [];
    this.form.reset();
  }

  confirm() {
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

  refreshTaskData() {
    this.taskList = [];
    this.fetchTasksByProjectId();
  }

  onWillDismiss(event: Event) {
    this.isModalOpen = false;
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  onSelectDateTime(event: CustomEvent) {
    this.selectedDateTime = event.detail.value;
  }

  addTag(tagValue: string): void {
    if (tagValue.trim() !== '') {
      this.tags.push(tagValue.trim());
    }
  }

  removeTag(tagToRemove: string): void {
    this.tags = this.tags.filter((tag) => tag !== tagToRemove);
  }

  addTask(taskData: TaskModel) {
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

  fetchTasksByProjectId() {
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

  updateTaskStatus(taskId: string, newStatus: string): void {
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

  selectionChange() {}

  handleStatusChange(newStatus: any, taskId: any) {
    this.updateTaskStatus(taskId, newStatus.detail.value);
  }

  handleStatusCancel() {}

  handleStatusDismiss() {}
}

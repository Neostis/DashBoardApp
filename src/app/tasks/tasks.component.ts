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
  newStatus!: string;

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
    this.form.reset();
    this.modal.dismiss();
  }

  confirm() {
    // const newCardData = {
    //   title: this.form.get('input1')?.value,
    //   content: this.form.get('input3')?.value,
    //   tags: this.tags,
    // };

    const newCardData: TaskModel = {
      title: this.form.get('input1')?.value,
      date: new Date(this.selectedDateTime),
      details: this.form.get('input3')?.value,
      projectId: this._ProjectId,
      // status: 'Yet to start',
      status: 'Yet to start',
      tags: this.tags, //['Tag1', 'Tag2'],
      members: this.form.value.input2, //['Member1', 'Member2', 'Member2'],
    };

    this.addTask(newCardData);
    this.selectedDateTime = '';
    this.form.reset();
    this.fetchTasksByProjectId();
    this.modal.dismiss();
  }

  refreshTaskData() {
    this.taskList = [];
    this.fetchTasksByProjectId();
  }

  onWillDismiss(event: Event) {
    // const ev = event as CustomEvent<OverlayEventDetail<string>>;
    // if (ev.detail.role === 'confirm') {
    //   this.message = `Hello, ${ev.detail.data}!`;
    // }
    this.isModalOpen = false;
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  onSelectDateTime(event: CustomEvent) {
    this.selectedDateTime = event.detail.value;
    console.log(this.selectedDateTime);
    console.log(this.formatDate(this.selectedDateTime));
  }

  //for testing
  formatDate(dateString: string): string {
    const formattedDate = this.datePipe.transform(
      dateString,
      'dd/MM/yyyy h:mm a'
    );
    return formattedDate || '';
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
        // Call the presentToast function
        console.log('Task added successfully:', response);
      },
      error: (error) => {
        // Handle error
        console.error('Error adding task:', error);
      },
      complete: () => {
        this.refreshTaskData();
        // Handle completion if needed
      },
    });
  }

  fetchTasksByProjectId(): void {
    this.mongoDBService.getTasksByProjectId(this._ProjectId).subscribe({
      next: (response) => {
        // Call the presentToast function
        this.taskList = response;
      },
      error: (error) => {
        // Handle error
        console.error('Error fetching tasks:', error);
      },
      complete: () => {
        console.log('Task List:', this.taskList);
        // Handle completion if needed
      },
    });
  }

  selectionChange() {
    console.log(this.form.value.input2);
  }

  handleStatusChange(newStatus: any, task: TaskModel) {}

  handleStatusCancel() {
    this.newStatus = '';
  }

  handleStatusDismiss() {
    this.newStatus = '';
  }
}

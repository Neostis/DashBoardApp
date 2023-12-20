import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  ],
  providers: [MongoDBService, DatePipe],
})
export class TasksComponent implements OnInit{
  form!: FormGroup;
  selected: string = 'Select a team member';
  newData: any[] = [];
  tags: string[] = [];
  selectedDateTime!: string;
  isModalOpen = false;

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
    this.fetchTasksByProjectId(this.sharedService.useProjectVariable()._id);
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
      date: new Date(),
      details: this.form.get('input3')?.value,
      projectId: this.sharedService.useProjectVariable()._id,
      status: 'YTS',
      tags: this.tags, //['Tag1', 'Tag2'],
      members: [], //['Member1', 'Member2', 'Member2'],
    };

    this.addTask(newCardData);

    // Push the new card data to newData array
    this.newData.push(newCardData);
    this.selectedDateTime = '';
    this.form.reset();
    this.modal.dismiss();
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
        // Handle completion if needed
      },
    });
  }

  fetchTasksByProjectId(projectId: string): void {
    this.mongoDBService.getTasksByProjectId(projectId).subscribe({
      next: (response) => {
        // Call the presentToast function
        console.log('Tasks: ', response);
      },
      error: (error) => {
        // Handle error
        console.error('Error fetching tasks:', error);
      },
      complete: () => {
        // Handle completion if needed
      },
    });
  }
}

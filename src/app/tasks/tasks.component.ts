import { Component, ViewChild } from '@angular/core';
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
  ],
  providers: [DatePipe],
})
export class TasksComponent {
  form!: FormGroup;
  selected: string = 'Select a team member';
  newData: any[] = [];
  tags: string[] = [];
  selectedDateTime!: string;

  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe) {
    this.form = this.formBuilder.group({
      input1: '',
      input2: '',
      input3: '',
    });
  }

  @ViewChild(IonModal) modal!: IonModal;

  message =
    'This modal example uses triggers to automatically open a modal when the button is clicked.';

  cancel() {
    this.form.reset();
    this.modal.dismiss();
  }

  confirm() {
    const newCardData = {
      title: this.form.get('input1')?.value,
      content: this.form.get('input3')?.value,
      tags: this.tags,
    };

    // Push the new card data to newData array
    this.newData.push(newCardData);
    this.selectedDateTime = '';
    this.form.reset();
    this.modal.dismiss();
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
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
}

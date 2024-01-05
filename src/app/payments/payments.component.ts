import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { PaymentModel } from '../model/payment.model';
import { MongoDBService } from '../services/mongoDB.service';
import { SharedService } from '../services/shared.service';
import { ProjectModel } from '../model/project.model';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [MongoDBService],
})
export class PaymentsComponent implements OnInit {
  form!: FormGroup;
  notificationList: string[] = [];

  _ProjectId!: string;
  projectList: ProjectModel[] = [];

  isHidden: boolean = true;

  payment: any;

  constructor(
    private formBuilder: FormBuilder,
    private mongoDBService: MongoDBService,
    private sharedService: SharedService
  ) {
    this.form = this.formBuilder.group({
      input1: 'Precise',
      input2: '',
      input3: 0,
      input4: false,
      input5: false,
      input6: false,
    });
  }
  ngOnInit(): void {
    this.loadProject();
    // this.form.valueChanges.subscribe((f) => {
    //   console.log(f);
    // });
  }

  private loadProject(): void {
    this.mongoDBService.getProjects().subscribe({
      next: (response) => {
        this.projectList = response;

        this.sharedService.updateProjectVariable(this.projectList[0]);
      },
      error: (error) => {
        console.error('Error retrieving files');
      },
      complete: () => {
        this._ProjectId = this.sharedService.useProjectVariable()?._id;
        this.getPayment();
      },
    });
  }

  private getPayment(): void {
    this.mongoDBService.getPayments(this._ProjectId).subscribe({
      next: (response: any) => {
        this.payment = response.payments[0];
      },
      error: (error) => {
        console.error('Error fetching payments');
      },
      complete: () => {
        this.form.get('input1')?.setValue(this.payment.usage);
        this.form.get('input2')?.setValue(this.payment.note);
        this.form.get('input3')?.setValue(parseInt(this.payment.budget));
        if (this.payment.notification.includes('Email')) {
          this.form.get('input4')?.setValue(true);
        }
        if (this.payment.notification.includes('Phone')) {
          this.form.get('input5')?.setValue(true);
        }
        this.form.get('input6')?.setValue(this.payment.change);
      },
    });
  }

  private updatePayment(data: PaymentModel): void {
    this.mongoDBService.updatePayment(data).subscribe({
      next: (response: any) => {
        console.log('Payment updated successfully');
      },
      error: (error) => {
        console.error('Error fetching payments');
      },
      complete: () => {
        this.getPayment();
      },
    });
  }

  discardChanged() {
    this.notificationList = [];
    this.form.reset();
    this.getPayment();
  }

  saveChanged() {
    if (this.form.value.input4) {
      this.notificationList.push('Email');
    }
    if (this.form.value.input5) {
      this.notificationList.push('Phone');
    }

    const testData: PaymentModel = {
      usage: this.form.value.input1,
      note: this.form.value.input2,
      budget: this.form.value.input3.toString(),
      change: this.form.value.input6,
      notification: this.notificationList,
      projectId: this._ProjectId,
    };

    this.updatePayment(testData);

    this.notificationList = [];
    this.form.reset();
  }

  incBudget() {
    this.form.get('input3')?.setValue(this.form.get('input3')?.value + 1000);
  }

  dcBudget() {
    if (this.form.value.input3 - 1000 >= 0) {
      this.form.get('input3')?.setValue(this.form.get('input3')?.value - 1000);
    }
  }
}

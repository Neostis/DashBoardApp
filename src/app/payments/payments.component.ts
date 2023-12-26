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

  testPayment: any;

  constructor(
    private formBuilder: FormBuilder,
    private mongoDBService: MongoDBService,
    private sharedService: SharedService
  ) {
    this.form = this.formBuilder.group({
      input1: 'Precise',
      input2: '',
      input3: '',
      input4: true,
      input5: false,
      input6: true,
    });
  }
  ngOnInit(): void {
    this.loadProject();
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
        this.getPayment();
      },
    });
  }

  private getPayment(): void {
    this.mongoDBService
      .getPayments(this.sharedService.useProjectVariable()._id)
      .subscribe({
        next: (response : any) => {
          // Call the presentToast function
          this.testPayment = response.payments;
          console.log('Payments:', response.payments[0]);
        },
        error: (error) => {
          // Handle error
          console.error('Error fetching payments:', error);
        },
        complete: () => {
          // Handle completion if needed
        },
      });
  }

  private updatePayment(data: PaymentModel): void {
    this.mongoDBService.updatePayment(data).subscribe({
      next: (response : any) => {
        // Call the presentToast function
        console.log('Payment updated successfully:', response);
      },
      error: (error) => {
        // Handle error
        console.error('Error fetching payments:', error);
      },
      complete: () => {
        // Handle completion if needed
      },
    });
  }

  saveChanged() {
    if (this.form.value.input4) {
      this.notificationList.push('Email');
    }
    if (this.form.value.input5) {
      this.notificationList.push('Phone');
    }

    const data: PaymentModel = {
      usage: this.form.value.input1,
      note: this.form.value.input1,
      budget: this.form.value.input1,
      change: this.form.value.input1,
      notification: this.notificationList,
      projectId: this._ProjectId,
    };

    const testData: PaymentModel = {
      usage: this.form.value.input1,
      note: this.form.value.input1,
      budget: '123',
      change: true,
      notification: this.notificationList,
      projectId: this._ProjectId,
    };


    this.updatePayment(testData)
    console.log(testData);
    
  }
}

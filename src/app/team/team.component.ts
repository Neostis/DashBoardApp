import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonModal, IonicModule } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule],
})
export class TeamComponent {
  form!: FormGroup;
  newData: any[] = [];

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      input1: '',
      // input2: '',
      // ... other inputs
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
    const newItem = {
      label: this.form.get('input1')?.value,
    };

    this.newData.push(newItem);
    this.form.reset();
    this.modal.dismiss();
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }
}

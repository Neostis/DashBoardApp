import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonModal, IonicModule } from '@ionic/angular';
import { MongoDBService } from '../services/mongoDB.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, HttpClientModule],
  providers: [MongoDBService],
})
export class TeamComponent {
  newData: any[] = [];
  isModalOpen = false;
  searchInput!: string;
  members: any[] = [];

  constructor(private mongoDBService: MongoDBService) {}

  @ViewChild(IonModal) modal!: IonModal;

  cancel() {
    this.modal.dismiss();
  }

  confirm() {
    const newItem = {
      label: this.searchInput,
    };

    this.newData.push(newItem);
    this.searchInput = '';
    this.modal.dismiss();
  }

  onWillDismiss(event: Event) {
    this.isModalOpen = false;
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  testGetMember(): void {
    this.mongoDBService.getAllMember().subscribe({
      next: (res) => {
        this.members = res;
      },
      error: (err) => {
        console.error('Error fetching members:', err);
      },
      complete: () => {
        console.log(this.members);
      },
    });
  }
}

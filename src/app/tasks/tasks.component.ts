import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class TasksComponent {
  constructor() {}

  newData: any[] = []; // Store data for new cards

  // Method to add a new card
  addNewCard() {
    // For example, you might have some data to add to the new card
    const newCardData = {
      // Populate with your data
      // For instance:
      title: 'New Card Title',
      description: 'New Card Description',
    };

    // Push the new card data to newData array
    this.newData.push(newCardData);
  }
}

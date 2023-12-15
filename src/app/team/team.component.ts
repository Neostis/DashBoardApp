import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonModal, IonicModule } from '@ionic/angular';
import { MongoDBService } from '../services/mongoDB.service';
import { HttpClientModule } from '@angular/common/http';
import { Subject, debounceTime, switchMap } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, HttpClientModule, MatSelectModule],
  providers: [MongoDBService],
})
export class TeamComponent {
  newData: any[] = [];
  isModalOpen = false;
  searchInput!: string;
  searchResult: any[] = [];
  members: any[] = [];

  private searchSubject: Subject<string> = new Subject<string>();

  constructor(private mongoDBService: MongoDBService) {
    this.searchSubject
      .pipe(
        debounceTime(300), // Adjust debounce time as needed
        // distinctUntilChanged(), // Avoid triggering for consecutive same values
        switchMap((term: string) => {
          if (term.trim() !== '') {
            return this.mongoDBService.searchMember(term);
          } else {
            return [];
          }
        })
      )
      .subscribe({
        next: (res) => {
          this.searchResult = res;
        },
        error: (err) => {
          console.error('Error fetching members:', err);
        },
      });
  }

  @ViewChild(IonModal) modal!: IonModal;

  cancel() {
    this.isModalOpen = false;
    this.searchInput = '';
  }

  confirm() {
    // const newItem = {
    //   label: this.searchInput,
    // };

    // this.newData.push(newItem);
    console.log(this.members);
    this.searchInput = '';
    this.isModalOpen = false;
  }

  onWillDismiss(event: Event) {
    this.isModalOpen = false;
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  // searchMember(): void {
  //   this.mongoDBService.searchMember(this.searchInput).subscribe({
  //     next: (res) => {
  //       this.searchResult = res;
  //     },
  //     error: (err) => {
  //       console.error('Error fetching members:', err);
  //     },
  //     complete: () => {
  //       // console.log(this.searchResult);
  //     },
  //   });
  // }

  // onSearch(event: any) {
  //   this.searchInput = event.target.value.trim();
  //   console.log(this.searchInput);
  //   if (this.searchInput !== '') {
  //     this.searchMember();
  //   } else {
  //     this.searchResult = [];
  //   }
  // }
  onSearch(event: any) {
    const query: string = event.target.value.trim();
    this.searchInput = query;
    this.searchSubject.next(query);
    if (query == '') {
      this.searchResult = [];
    }
  }

  onClearSearch() {
    this.searchResult = [];
  }

  handleDivClick(event: Event) {
    // Prevent the click event from propagating further
    event.stopPropagation();
  }

  checkboxChange(selectItem: any) {
    this.members.push(selectItem);
  }
}

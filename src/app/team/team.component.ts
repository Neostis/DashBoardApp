import { SharedService } from './../services/shared.service';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonModal, IonicModule } from '@ionic/angular';
import { MongoDBService } from '../services/mongoDB.service';
import { HttpClientModule } from '@angular/common/http';
import { Subject, debounceTime, switchMap } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MemberModel } from '../model/member.model';

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
  selectedTypes: string[] = [];
  members: any[] = [];

  options = [
    { value: 'Owner', label: 'Owner' },
    { value: 'Guest', label: 'Guest' },
    { value: 'Editor', label: 'Can Edit' },
  ];

  private searchSubject: Subject<string> = new Subject<string>();

  constructor(
    private mongoDBService: MongoDBService,
    private sharedService: SharedService
  ) {
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
          this.selectedTypes = this.searchResult.flatMap(
            (member: MemberModel) =>
              member.projects.map((project) => project.type)
          );
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
    const member: MemberModel = {
      name: 'testName',
      role: 'testRole',
      email: 'testEmail',
    };
    // const newItem = {
    //   label: this.searchInput,
    // };

    // this.newData.push(newItem);
    // console.log(member);
    this.addMember(member);
    this.searchInput = '';
    this.searchResult = [];
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

  checkboxChange(event: any, selectedMember: any, index: number) {
    const checkboxValue = event.detail.checked;
    if (checkboxValue) {
      selectedMember.type = this.selectedTypes[index];
      console.log(selectedMember);
    }
    // this.members.push(selectedMember);
  }

  addMember(member: any) {
    this.mongoDBService.addMember(member).subscribe({
      next: (response) => {
        // Call the presentToast function
        console.log('Member added successfully:', response);
      },
      error: (error) => {
        // Handle error
        console.error('Error adding member:', error);
      },
      complete: () => {
        // Handle completion if needed
      },
    });
  }

  addMember(member: any) {
    this.mongoDBService.addMember(member).subscribe({
      next: (response) => {
        // Call the presentToast function
        console.log('Member added successfully:', response);
      },
      error: (error) => {
        // Handle error
        console.error('Error adding member:', error);
      },
      complete: () => {
        // Handle completion if needed
      },
    });
  }
}

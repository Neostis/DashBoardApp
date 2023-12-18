import { SharedService } from './../services/shared.service';
import { Component, OnInit, ViewChild } from '@angular/core';
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
export class TeamComponent implements OnInit{
  newData: any[] = [];
  isModalOpen = false;
  searchInput!: string;
  searchResult: any[] = [];
  members: any[] = [];
  role: string = '""'

  //Test
   member: MemberModel[] = [{
    name: 'testName',
    role: 'testRole',
    email: 'testEmail@gmail.com',
    projects: [
      {
        projectID: this.sharedService.useProjectVariable()._id,
        type: 'testType',
      },
    ],
  }
  ,{
    name: 'testName2',
    role: 'testRole2',
    email: 'testEmail2@gmail.com',
    projects: [
      {
        projectID: this.sharedService.useProjectVariable()._id,
        type: 'testType2',
      },
    ],
  },
];
  ngOnInit(): void {

    this.getMembers(this.role)
  }

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
    this.addMembers(this.member);
    // this.updateRole(this.members[3], "Test02")
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

  addMembers(members: MemberModel[]) {
    members.forEach(member => {
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
    });
 }

 getMembers(role : string){
  this.mongoDBService.getMembers(role).subscribe({
    next: (response) => {
      // Call the presentToast function
      this.members = response
      console.log('get Member successfully:', response);
    },
    error: (error) => {
      // Handle error
      console.error('Error getting member:', error);
    },
    complete: () => {
      // Handle completion if needed
    },
  });
 }

 updateRole(member: any, newRole: string): void {
  
  this.mongoDBService.updateMemberRole(member._id, newRole)
  .subscribe({
    next: (response) => {
      // Call the presentToast function
      console.log('Member role updated successfully:', response);
    },
    error: (error) => {
      // Handle error
      console.error('Failed to update member role:', error);
    },
    complete: () => {
      // Handle completion if needed
    },
  });
}

}

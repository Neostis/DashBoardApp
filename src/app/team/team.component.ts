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
  _ProjectId: string = '657aa5e1770d840a02e05056';
  newData: any[] = [];
  isModalOpen = false;
  searchInput!: string;
  searchResult: any[] = [];
  selectedTypes: string[] = [];
  checkboxList: boolean[] = [];
  members: any[] = [];

  options = [
    { value: 'Owner', label: 'Owner' },
    { value: 'Guest', label: 'Guest' },
    { value: 'Editor', label: 'Can Edit' },
  ];

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
          this.selectedTypes = new Array(this.searchResult.length).fill(
            'Owner'
          );
          this.checkboxList = new Array(this.searchResult.length).fill(false);
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
    //use from members array instead
    const member: MemberModel = {
      name: 'testName',
      role: 'testRole',
      email: 'testEmail',
      projects: [
        {
          projectId: this._ProjectId,
          type: 'Owner',
        },
      ],
    };

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

    const project = {
      projectId: this._ProjectId,
      type: this.selectedTypes[index],
    };

    if (checkboxValue) {
      this.checkboxList[index] = true;
      selectedMember.projects.push(project);
      this.members.push(selectedMember);
    } else {
      selectedMember.projects = selectedMember.projects.filter(
        (project: any) => project.projectId !== this._ProjectId
      );

      this.members = this.members.filter(
        (member: any) => member._id !== selectedMember._id
      );
    }
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

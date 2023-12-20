import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonModal, IonicModule } from '@ionic/angular';
import { MongoDBService } from '../services/mongoDB.service';
import { HttpClientModule } from '@angular/common/http';
import { Observable, Subject, debounceTime, find, of, switchMap } from 'rxjs';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MemberModel } from '../model/member.model';
import { SharedService } from '../services/shared.service';
import { ProjectModel } from '../model/project.model';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, HttpClientModule, MatSelectModule],
  providers: [MongoDBService],
})
export class TeamComponent implements OnInit {
  _ProjectId!: string;
  currentMember: any[] = [];
  isModalOpen = false;
  modalSearchInput!: string;
  modalSearchResult: any[] = [];
  mainSearchInput!: string;
  mainSearchResult: any[] = [];
  selectedTypes: string[] = [];
  checkboxList: boolean[] = [];
  members: any[] = [];
  projectList: ProjectModel[] = [];

  options = [
    { value: 'Owner', label: 'Owner' },
    { value: 'Guest', label: 'Guest' },
    { value: 'Editor', label: 'Can Edit' },
  ];

  private callSearchMember: Subject<string> = new Subject<string>();

  constructor(
    private mongoDBService: MongoDBService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.loadProject();
    this.callSearchMember
      .pipe(
        debounceTime(300),
        switchMap((term: string) => this.searchMembers(term))
      )
      .subscribe({
        next: (res) => {
          this.modalSearchResult = res;
          this.updateSelectedTypesAndCheckboxList();
        },
        error: (err) => {
          console.error('Error fetching members:', err);
        },
      });
  }

  private loadMember(): void {
    this.mongoDBService.getProjectMembers(this._ProjectId).subscribe({
      next: (response) => {
        // Assuming your response has a 'data' property with the files
        this.currentMember = response;
        this.mainSearchResult = response;
      },
      error: (error) => {
        console.error('Error Message:', error);
      },
      complete: () => {
        console.log('Current members:', this.currentMember);
      },
    });
  }

  private loadProject(): void {
    this.mongoDBService.getProjects().subscribe({
      next: (response) => {
        // Assuming your response has a 'data' property with the files
        this.projectList = response;

        this.sharedService.updateProjectVariable(this.projectList[0]);
      },
      error: (error) => {
        console.error('Error retrieving files:', error);
      },
      complete: () => {
        this._ProjectId = this.sharedService.useProjectVariable()?._id;
        this.loadMember();
      },
    });
  }

  private searchMembers(term: string): Observable<any> {
    if (term.trim() !== '') {
      return this.mongoDBService.searchMember(term, this._ProjectId);
    } else {
      return of([]);
    }
  }

  private updateSelectedTypesAndCheckboxList(): void {
    this.modalSearchResult.forEach((project: any) => {
      if (project.projects && project.projects.length > 0) {
        project.projects.forEach((subProject: any) => {
          if (subProject.type) {
            this.selectedTypes.push(subProject.type);
          }
        });
      } else {
        this.selectedTypes.push('Owner');
      }
    });
    this.checkboxList = new Array(this.modalSearchResult.length).fill(false);
    console.log(this.selectedTypes);
  }

  @ViewChild(IonModal) modal!: IonModal;

  cancel() {
    this.isModalOpen = false;
    this.modalSearchInput = '';
  }

  refreshMember() {
    this.mainSearchResult = [];
    this.currentMember = [];
    this.loadMember();
  }

  confirm() {
    this.addMember(this.members);
    this.modalSearchInput = '';
    this.modalSearchResult = [];
    this.refreshMember();
    this.isModalOpen = false;
  }

  onWillDismiss(event: Event) {
    this.isModalOpen = false;
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  onModalSearch(event: any) {
    const query: string = event.target.value.trim();
    this.modalSearchInput = query;
    this.callSearchMember.next(query);
    if (query == '') {
      this.modalSearchResult = [];
    }
  }

  onClearModalSearch() {
    this.modalSearchResult = [];
  }

  onMainSearch(event: any) {
    if (!this.mainSearchInput) {
      this.refreshMember();
    } else {
    }
  }

  onClearMainSearch() {
    this.refreshMember();
  }

  checkboxChange(event: any, selectedMember: any, index: number) {
    const checkboxValue = event.detail.checked;

    const project = {
      projectId: this._ProjectId,
      type: this.selectedTypes[index],
    };

    if (checkboxValue) {
      this.checkboxList[index] = true;
      this.addMemberToProjects(selectedMember, project);
    } else {
      this.removeMemberFromProjects(selectedMember, project);
    }
  }

  selectionChange(selectedMember: any, index: number) {
    const foundMember = this.members.find((m) => {
      return m._id === selectedMember._id;
    });

    if (foundMember) {
      const selectProject = foundMember.projects.find(
        (p: any) => p.projectId === this._ProjectId
      );
      selectProject.type = this.selectedTypes[index];
    }
  }

  private addMemberToProjects(selectedMember: any, project: any) {
    selectedMember.projects.push(project);
    this.members.push(selectedMember);
  }

  private removeMemberFromProjects(selectedMember: any, project: any) {
    selectedMember.projects = selectedMember.projects.filter(
      (p: any) => p.projectId !== project.projectId
    );

    this.members = this.members.filter(
      (member: any) => member._id !== selectedMember._id
    );
  }

  addMember(members: any) {
    members.forEach((member: any) => {
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
}

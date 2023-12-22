import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonModal, IonicModule } from '@ionic/angular';
import { MongoDBService } from '../services/mongoDB.service';
import { HttpClientModule } from '@angular/common/http';
import { Observable, Subject, debounceTime, find, of, switchMap } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
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

  private modalSearchMember: Subject<string> = new Subject<string>();
  private mainSearchMember: Subject<string> = new Subject<string>();

  constructor(
    private mongoDBService: MongoDBService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.loadProject();
    this.modalSearchMember
      .pipe(
        debounceTime(300),
        switchMap((term: string) => this.searchModalMembers(term))
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
        this.mainSearchResult = response;
      },
      error: (error) => {
        console.error('Error Message:', error);
      },
      complete: () => {},
    });
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
        this.loadMember();
      },
    });
  }

  private searchModalMembers(term: string): Observable<any> {
    if (term.trim() !== '') {
      return this.mongoDBService.searchMember(term, this._ProjectId);
    } else {
      return of([]);
    }
  }

  private searchMainMembers(term: string) {
    if (term.trim() !== '') {
      const foundValue = this.mainSearchResult.filter(
        (data) =>
          data.name.toLowerCase().includes(term.toLowerCase()) ||
          data.role.toLowerCase().includes(term.toLowerCase()) ||
          data.email.toLowerCase().includes(term.toLowerCase()) ||
          data.projects.some(
            (p: any) =>
              p.projectId === this._ProjectId &&
              p.type.toLowerCase().includes(term.toLowerCase())
          )
      );

      if (foundValue) {
        this.mainSearchResult = foundValue;
      }
    }
  }

  private updateSelectedTypesAndCheckboxList(): void {
    this.modalSearchResult.forEach((project: any) => {
      if (project.projects && project.projects.length > 0) {
        project.projects.forEach((subProject: any) => {
          if (subProject.projectId === this._ProjectId) {
            this.selectedTypes.push(subProject.type);
          }
        });
      } else {
        this.selectedTypes.push('Guest');
      }
    });
    this.checkboxList = new Array(this.modalSearchResult.length).fill(false);
  }

  @ViewChild(IonModal) modal!: IonModal;

  cancel() {
    this.isModalOpen = false;
    this.refreshModalData();
  }

  refreshMainData() {
    this.mainSearchInput = '';
    this.mainSearchResult = [];
    this.selectedTypes = [];
    this.loadMember();
  }

  refreshModalData() {
    this.modalSearchInput = '';
    this.modalSearchResult = [];
    this.selectedTypes = [];
    this.members = [];
  }

  confirm() {
    // this.addMember(this.members);
    // this.updateMemberType(this.members);
    this.addOrUpdateMember(this.members);
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
    this.modalSearchMember.next(query);
    if (query == '') {
      this.modalSearchResult = [];
    }
  }

  onClearModalSearch() {
    this.modalSearchResult = [];
  }

  onMainSearch(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    if (searchValue.trim() !== '') {
      this.searchMainMembers(searchValue);
    } else {
      this.refreshMainData();
    }
  }

  onClearMainSearch() {
    this.refreshMainData();
  }

  checkboxChange(event: any, selectedMember: any, index: number) {
    const checkboxValue = event.detail.checked;

    const project = {
      projectId: this._ProjectId,
      type: this.selectedTypes[index],
    };

    if (checkboxValue) {
      this.checkboxList[index] = true;

      const InProject = selectedMember.projects.find(
        (p: any) => p.projectId === this._ProjectId
      );

      if (!InProject) {
        this.addMemberToProjects(selectedMember, project);
      } else {
        this.updateMemberProjects(selectedMember, null, false);
      }
    } else {
      this.removeMemberFromProjects(selectedMember, project);
    }
  }

  selectionChange(selectedMember: any, index: number) {
    const project = selectedMember.projects.find(
      (p: any) => p.projectId === this._ProjectId
    );

    project.type = this.selectedTypes[index];
    const alreadyMember = this.members.find(
      (m) => m._id === selectedMember._id
    );
    if (alreadyMember) {
      this.updateMemberProjects(selectedMember, project, true);
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

  private updateMemberProjects(
    selectedMember: any,
    project: any,
    alreadyMember: boolean
  ) {
    if (alreadyMember) {
      const updateMember = this.members.find(
        (m) => m._id === selectedMember._id
      );

      const memberProject = updateMember.projects.find(
        (p: any) => p.projectId === this._ProjectId
      );

      memberProject.type = project.type;
    } else {
      this.members.push(selectedMember);
    }
  }

  addOrUpdateMember(members: any) {
    members.forEach((member: any) => {
      this.mongoDBService.addOrUpdateMember(member).subscribe({
        next: (response) => {
          // Call the presentToast function
          console.log('Member added successfully:', response);
        },
        error: (error) => {
          // Handle error
          console.error('Error adding member:', error);
        },
        complete: () => {
          this.refreshMainData();
          this.refreshModalData();
          // Handle completion if needed
        },
      });
    });
  }
}

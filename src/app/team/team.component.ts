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
        this.currentMember = response;
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
          if (subProject.projectId === this._ProjectId) {
            this.selectedTypes.push(subProject.type);
          }
        });
      } else {
        this.selectedTypes.push('Owner');
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
    this.mainSearchResult = [];
    this.currentMember = [];
    this.selectedTypes = [];
    this.loadMember();
  }

  refreshModalData() {
    this.modalSearchInput = '';
    this.modalSearchResult = [];
    this.selectedTypes = [];
    this.members = [];
  }

  //unfinish
  confirm() {
    // this.addMember(this.members);
    this.updateMemberType(this.members);
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

  //unfinish
  onMainSearch(event: any) {
    if (!this.mainSearchInput) {
      this.refreshMainData();
    } else {
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

  updateMemberType(members: any) {
    console.log('member before update: ', members);
    let correctProject: { projectId: string; type: string };
    members.forEach((member: any) => {
      member.projects.forEach(
        (project: { projectId: string; type: string }) => {
          if (project.projectId == this._ProjectId) {
            correctProject = project;
          }
        }
      );

      console.log('new data: ', correctProject);

      this.mongoDBService
        .updateMemberType(member._id, this._ProjectId, correctProject.type)
        .subscribe({
          next: (response) => {
            // Call the presentToast function
            console.log('Member update successfully:', response);
          },
          error: (error) => {
            // Handle error
            console.error('Error update member:', error);
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

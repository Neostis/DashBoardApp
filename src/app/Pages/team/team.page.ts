import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonModal, IonicModule } from '@ionic/angular';
import { MongoDBService } from '../../services/mongoDB.service';
import { Observable, Subject, debounceTime, find, of, switchMap } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { SharedService } from '../../services/shared.service';
import { ProjectModel } from '../../model/project.model';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.page.html',
  styleUrls: ['./team.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, MatSelectModule],
})
export class TeamPage implements OnInit {
  protected _ProjectId!: string;
  protected isModalOpen = false;
  protected modalSearchInput!: string;
  protected modalSearchResult: any[] = [];
  protected mainSearchInput!: string;
  protected mainSearchResult: any[] = [];
  protected selectedTypes: string[] = [];
  protected checkboxList: boolean[] = [];
  private members: any[] = [];
  protected projectList: ProjectModel[] = [];

  protected options = [
    { value: 'Owner', label: 'Owner' },
    { value: 'Guest', label: 'Guest' },
    { value: 'Editor', label: 'Can Edit' },
  ];

  private modalSearchMember: Subject<string> = new Subject<string>();

  constructor(
    private mongoDBService: MongoDBService,
    private storeService: StorageService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    if (this._ProjectId) {
      this.loadMember();
    }

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

  ionViewWillEnter() {
    this.storeService.get('currentProject').then((data) => {
      if (data) {
        this._ProjectId = data.value;
        if (this._ProjectId) {
          this.loadMember();
        }
      }
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

  protected cancel() {
    this.isModalOpen = false;
    this.refreshModalData();
  }

  private refreshMainData() {
    this.mainSearchInput = '';
    this.mainSearchResult = [];
    this.selectedTypes = [];
    this.loadMember();
  }

  private refreshModalData() {
    this.modalSearchInput = '';
    this.modalSearchResult = [];
    this.selectedTypes = [];
    this.members = [];
  }

  protected confirm() {
    // this.addMember(this.members);
    // this.updateMemberType(this.members);
    this.addOrUpdateMember(this.members);
    this.isModalOpen = false;
  }

  protected onWillDismiss(event: Event) {
    this.isModalOpen = false;
  }

  protected setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  protected onModalSearch(event: any) {
    const query: string = event.target.value.trim();
    this.modalSearchInput = query;
    this.modalSearchMember.next(query);
    if (query == '') {
      this.modalSearchResult = [];
    }
  }

  protected onClearModalSearch() {
    this.modalSearchResult = [];
  }

  protected onMainSearch(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    if (searchValue.trim() !== '') {
      this.searchMainMembers(searchValue);
    } else {
      this.refreshMainData();
    }
  }

  protected onClearMainSearch() {
    this.refreshMainData();
  }

  protected checkboxChange(event: any, selectedMember: any, index: number) {
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

  protected selectionChange(selectedMember: any, index: number) {
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

  private addOrUpdateMember(members: any) {
    members.forEach((member: any) => {
      this.mongoDBService.addOrUpdateMember(member).subscribe({
        next: (response) => {
          console.log('Member added successfully:', response);
        },
        error: (error) => {
          console.error('Error adding member:', error);
        },
        complete: () => {
          this.refreshMainData();
          this.refreshModalData();
        },
      });
    });
  }
}

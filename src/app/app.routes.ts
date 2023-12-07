import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomepageComponent } from './homepage/homepage.component';
import { FilesContainerComponent } from './files/files.component';
import { PaymentsComponent } from './payments/payments.component';
import { TeamComponent } from './team/team.component';
import { TasksComponent } from './tasks/tasks.component';
import { TimelineComponent } from './timeline/timeline.component';
import { FilesManagerContainerComponent } from './fileManager/filesManager.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'home',
    component: HomepageComponent,
  },
  {
    path: 'timeline',
    component: TimelineComponent,
  },
  {
    path: 'files',
    component: FilesContainerComponent,
  },
  {
    path: 'tasks',
    component: TasksComponent,
  },
  {
    path: 'team',
    component: TeamComponent,
  },
  {
    path: 'payments',
    component: PaymentsComponent,
  },
  {
    path: 'filesManager',
    component: FilesManagerContainerComponent,
  },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];

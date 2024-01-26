import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./Pages/home/home.page').then((m) => m.HomePage),
    canActivate: [AuthGuard],
  },
  {
    path: 'timeline',
    loadComponent: () =>
      import('./Pages/timeline/timeline.page').then((m) => m.TimelinePage),
    canActivate: [AuthGuard],
  },
  {
    path: 'files',
    loadComponent: () =>
      import('./Pages/files/files.page').then((m) => m.FilesPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'files/filesManager',
    loadComponent: () =>
      import('./Pages/filesManager/filesManager.page').then(
        (m) => m.FilesManagerPage
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./Pages/tasks/tasks.page').then((m) => m.TasksPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'team',
    loadComponent: () =>
      import('./Pages/team/team.page').then((m) => m.TeamPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'payments',
    loadComponent: () =>
      import('./Pages/payments/payments.page').then((m) => m.PaymentsPage),
    canActivate: [AuthGuard],
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./Auth/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./Auth/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./Pages/profile/profile.page').then((m) => m.ProfilePage),
    // canActivate: [AuthGuard],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
  // { path: '', redirectTo: 'profile', pathMatch: 'full' },
  // { path: '**', redirectTo: 'profile' },
];

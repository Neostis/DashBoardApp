import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./Pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'timeline',
    loadComponent: () =>
      import('./Pages/timeline/timeline.page').then((m) => m.TimelinePage),
  },
  {
    path: 'files',
    loadComponent: () =>
      import('./Pages/files/files.page').then((m) => m.FilesPage),
  },
  {
    path: 'files/filesManager',
    loadComponent: () =>
      import('./Pages/filesManager/filesManager.page').then(
        (m) => m.FilesManagerPage
      ),
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./Pages/tasks/tasks.page').then((m) => m.TasksPage),
  },
  {
    path: 'team',
    loadComponent: () =>
      import('./Pages/team/team.page').then((m) => m.TeamPage),
  },
  {
    path: 'payments',
    loadComponent: () =>
      import('./Pages/payments/payments.page').then((m) => m.PaymentsPage),
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
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];

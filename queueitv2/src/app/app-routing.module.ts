import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth' },
  { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
  { path: 'auth', loadChildren: './authentication/authentication.module#AuthenticationModule' },
  { path: 'operations', loadChildren: './operations/operations.module#OperationsModule' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);

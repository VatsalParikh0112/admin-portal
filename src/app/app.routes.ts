import { Routes } from '@angular/router';

import { Login } from './routes/login/login';
import { Shell } from './routes/shell/shell';
import { Verification } from './routes/verification/verification';
import { Pharmacies } from './routes/pharmacies/pharmacies';
import { Support } from './routes/support/support';
import { adminGuard, adminGuestGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Admin Login',
    component: Login,
    canActivate: [adminGuestGuard],
  },
  {
    path: '',
    component: Shell,
    canActivate: [adminGuard],
    children: [
      { path: 'verification', title: 'Verification', component: Verification },
      { path: 'pharmacies', title: 'Pharmacies', component: Pharmacies },
      { path: 'support', title: 'Support', component: Support },
      { path: '', redirectTo: 'verification', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];

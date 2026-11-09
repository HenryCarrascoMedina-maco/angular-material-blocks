import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'angular-material-blocks',
    loadComponent: () => import('./demo/home/home').then((m) => m.Home),
  },
  {
    path: 'tabla',
    title: 'Tabla genérica · angular-material-blocks',
    loadComponent: () => import('./demo/pages/table-demo/table-demo').then((m) => m.TableDemo),
  },
  {
    path: 'eventos',
    title: 'Tabla con tu backend · angular-material-blocks',
    loadComponent: () => import('./demo/pages/eventos-api/eventos-api').then((m) => m.EventosApi),
  },
  { path: '**', redirectTo: '' },
];

import { Routes } from '@angular/router';
import { Contact } from './contact/contact';
import { Home } from './home/home';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Home, title: 'G Pandey Trust | Here for You' },
  { path: 'contact', component: Contact, title: 'Contact Us | G Pandey Trust' },
  { path: '**', redirectTo: '' },
];

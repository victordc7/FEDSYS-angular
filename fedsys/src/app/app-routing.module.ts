import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TableComponent } from './componets/table/table.component';
import { RegisterComponent } from './componets/register/register.component';
import { PreRegistrationComponent } from './componets/pre-registration/pre-registration.component';
import { NewTourneyComponent } from './componets/new-tourney/new-tourney.component';

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  {
    path: 'inicio',
    component: DashboardComponent
  },
  {
    path: 'tabla',
    component: TableComponent
  },
  {
    path: 'pre_registro',
    component: PreRegistrationComponent
  },
  {
    path: 'nuevo_torneo',
    component: NewTourneyComponent,
    // children: [
    //   { path: 'registro', component: RegisterComponent }
    // ]
  },
  { path: '**', redirectTo: 'inicio' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

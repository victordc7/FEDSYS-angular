import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TableComponent } from './componets/table/table.component';
import { RegisterComponent } from './componets/register/register.component';
import { PreRegistrationComponent } from './componets/pre-registration/pre-registration.component';
import { NewTourneyComponent } from './componets/new-tourney/new-tourney.component';
import { BeginTourneyComponent } from './componets/begin-tourney/begin-tourney.component';
import { TourneyManagerComponent } from './componets/tourney-manager/tourney-manager.component';

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
    path: 'empezar_torneo',
    component: BeginTourneyComponent
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
    {
      path: 'gestion_torneo/:id',
      component: TourneyManagerComponent
    },
    { path: '**', redirectTo: 'inicio' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

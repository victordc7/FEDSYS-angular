import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TableComponent } from './componets/table/table.component';
import { RegCategoriesComponent } from './componets/reg-categories/reg-categories.component';
import { RegCompetidoresComponent } from './componets/reg-competidores/reg-competidores.component';

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
    path: 'categories',
    component: RegCategoriesComponent
  },
  {
    path: 'competitors',
    component: RegCompetidoresComponent
  },
  { path: '**', redirectTo: 'inicio' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

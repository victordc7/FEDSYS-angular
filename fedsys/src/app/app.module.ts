import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { MatGridListModule, MAT_DATE_LOCALE } from '@angular/material';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TableComponent } from './componets/table/table.component';
import { RegCompetidoresComponent } from './componets/reg-competidores/reg-competidores.component';
import { RegJudgesComponent } from './componets/reg-judges/reg-judges.component';
import { RegTourneyComponent } from './componets/reg-tourney/reg-tourney.component';
import { RegCategoriesComponent } from './componets/reg-categories/reg-categories.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TableComponent,
    RegCompetidoresComponent,
    RegJudgesComponent,
    RegTourneyComponent,
    RegCategoriesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatGridListModule,
    HttpClientModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

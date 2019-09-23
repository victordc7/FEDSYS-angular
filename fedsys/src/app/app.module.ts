import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material Modules
import { MatDialogModule } from "@angular/material";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { MatGridListModule, MAT_DATE_LOCALE } from '@angular/material';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TableComponent } from './componets/table/table.component';
import { RegCompetidoresComponent } from './componets/register/reg-competidores/reg-competidores.component';
import { RegJudgesComponent } from './componets/register/reg-judges/reg-judges.component';
import { RegTourneyComponent } from './componets/register/reg-tourney/reg-tourney.component';
import { RegCategoriesComponent } from './componets/register/reg-categories/reg-categories.component';
import { RegisterComponent } from './componets/register/register.component';
import { NewTourneyComponent } from './componets/new-tourney/new-tourney.component';
import { PreRegistrationComponent } from './componets/pre-registration/pre-registration.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RegNewCompetitorsComponent } from './componets/register/reg-new-competitors/reg-new-competitors.component';
import { StartingOrderComponent } from './componets/register/starting-order/starting-order.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TableComponent,
    RegisterComponent,
    RegTourneyComponent,
    RegCategoriesComponent,
    RegCompetidoresComponent,
    RegNewCompetitorsComponent,
    RegJudgesComponent,
    NewTourneyComponent,
    PreRegistrationComponent,
    NavbarComponent,
    StartingOrderComponent,
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatGridListModule,
    HttpClientModule,
    MatDialogModule,
  ],

  entryComponents: [
    RegCategoriesComponent,
    RegCompetidoresComponent,
    RegJudgesComponent,
    RegTourneyComponent,
    RegNewCompetitorsComponent,
    StartingOrderComponent
  ],

  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from "@angular/material";

import { Judge } from '../../models/judge.model';
import { ServiceService } from 'src/app/service.service';
import { RegCategoriesComponent } from './reg-categories/reg-categories.component';
import { RegCompetidoresComponent } from './reg-competidores/reg-competidores.component';
import { RegJudgesComponent } from './reg-judges/reg-judges.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  @Input() tournamentType;
  public competitors = [];
  public judges: Judge[] = [];
  private body;
  public categoriesArray = [];
  public subcategoriesArray = [];

  constructor(
    private serverService: ServiceService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    console.log(this.tournamentType)
    this.body = {
      query:` query {
        categories
        { _id
          number
          name
        },
      }`
    };

    // Initialize categories and subcategories
    this.serverService.graphql(this.body)
    .subscribe(res => {
      console.log(res);
      this.categoriesArray.push(res['data']['categories']);
      // this.categoriesArray.push(res['data']['subcategories']);
      console.log(this.categoriesArray)
    });
  }

  addCategory() {

    const dialogRef = this.dialog.open(RegCategoriesComponent, {
      width: '50%',
      data: this.categoriesArray[0]
    });
    // console.log('hello' + dialogRef.data);
    dialogRef.afterClosed().subscribe(result => {
        console.log("Dialog output:", result)
        if (result.level === 'Sub-category'){
          this.createSubcategory(result);
        } else {
          this.createCategory(result);
        }
      });
  }

  addCompetitor() {

    const dialogRef = this.dialog.open(RegCompetidoresComponent, {
      width: '50%',
      data: this.subcategoriesArray[0]
    });
    // console.log('hello' + dialogRef.data);
    dialogRef.afterClosed().subscribe(result => {
        console.log("Dialog output:", result)
        this.splitCompetitorByCategory(result);
        // this.serverService.graphql(this.body).subscribe(res => console.log(res));
      });
  }

  addJudge() {

    const dialogRef = this.dialog.open(RegJudgesComponent, {
      width: '50%',
      data: this.categoriesArray[0]
    });
    // console.log('hello' + dialogRef.data);
    dialogRef.afterClosed().subscribe(result => {
        console.log("Dialog output:", result);
        this.judges.push(result);
      });
  }

  createSubcategory(form) {
    this.body = {
      query: `mutation {
        createCategory(input: {
          name: "${form.name}"
          parent: ${form.parent}
        }) {.
          _id
          name
        }
      }`
    };
    // Llamada a servicio
    this.serverService.graphql(this.body)
    .subscribe(res => {
      console.log(res);
      this.subcategoriesArray.push(res['data']['createSubcategory']);
    });
  }

  createCategory(form) {

      this.body = {
        query: `mutation {
          createCategory(input: {
            name: "${form.name}"
          }) {
            _id
            name
          }
        }`
      };

      // Llamada a servicio
      this.serverService.graphql(this.body)
      .subscribe(res => {
        console.log(res);
        this.categoriesArray.push(res['data']['createCategory']);
      });
  }


  splitCompetitorByCategory(form) {

    for (let i = 0; i < form.categories.length; i++) {
      const competitor = {
        firstName: form.firstName,
        lastName: form.lastName,
        personalId: form.personalId,
        age: form.age,
        gender: form.gender,
        city: form.city,
        category: form.categories[i],
        email: form.email,
        phone: form.phone,
      }
      this.competitors.push(competitor);
    }
    this.modifyTourney(this.competitors);
  }

  modifyTourney(modification) {
    if(modification === this.competitors){
      this.body = {
        query: `mutation {
          updateTourney(input: {
            competitors: "${modification}"
          }) {
            _id
            competitors
          }
        }`
      };
    } else if(modification === this.categoriesArray) {
      this.body = {
        query: `mutation {
          updateTourney(input: {
            categories: "${modification}"
          }) {
            _id
            categories
          }
        }`
      };
    } else if(modification === this.subcategoriesArray){
      this.body = {
        query: `mutation {
          updateTourney(input: {
            subcategories: "${modification}"
          }) {
            _id
            categories
          }
        }`
      };
    }
    // Llamada a servicio
    this.serverService.graphql(this.body)
    .subscribe(res => {
      console.log(res);
    });
  }
}

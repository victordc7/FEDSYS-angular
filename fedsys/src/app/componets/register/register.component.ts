import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material";

import { Judge } from '../../models/judge.model';
import { Competitor } from '../../models/competitor.model';
import { Category } from '../../models/category.model';
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

  public competitors: Competitor[] = [];
  public judges: Judge[] = [];
  // public categoriesArray= [];

  // public categoriesArray: Category[] = [
  //   new Category(
  //     1,
  //     'Fisico Culturismo',
  //     1,
  //     null
  //   ),
  //   new Category(
  //     2,
  //     'Bikini',
  //     1,
  //     null
  //   ),
  //   new Category(
  //     3,
  //     'Fisicoculturismo junior',
  //     2,
  //     1
  //   ),
  //   new Category(
  //     4,
  //     'Bikini Masculino',
  //     2,
  //     2
  //   )
  // ];

  public categoriesArray = [];
  constructor(
    private serverService: ServiceService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {

    const body = {
      query:` query {
        categories
        { name
          number
        }
      }`
    };

    this.serverService.graphql(body)
    .subscribe(res => {
      console.log(res);
      this.categoriesArray.push(res['data']['categories']);
      console.log(this.categoriesArray)
    });
  }

  addCategory() {

    const dialogRef = this.dialog.open(RegCategoriesComponent, {
      width: '50%',
      data: this.categoriesArray
    });
    // console.log('hello' + dialogRef.data);
    dialogRef.afterClosed().subscribe(result => {
        console.log("Dialog output:", result)
        this.createCategory(result)
      });
  }

  addCompetitor() {

    const dialogRef = this.dialog.open(RegCompetidoresComponent, {
      width: '50%',
      data: this.categoriesArray
    });
    // console.log('hello' + dialogRef.data);
    dialogRef.afterClosed().subscribe(result => {
        console.log("Dialog output:", result)
        this.competitors.push(result);
        // this.serverService.graphql(body).subscribe(res => console.log(res));
      });
  }

  addJudge() {

    const dialogRef = this.dialog.open(RegJudgesComponent, {
      width: '50%',
      data: this.categoriesArray
    });
    // console.log('hello' + dialogRef.data);
    dialogRef.afterClosed().subscribe(result => {
        console.log("Dialog output:", result);
        this.judges.push(result);
      });
  }

  createCategory(form) {
    const body = {
      query: `mutation {
        createCategory(input: {
          number: ${form.number}
          name: "${form.name}"
          level: ${form.level}
          parent: ${form.parent}
        }) {
          number
          name
        }
      }`
    };

    // Llamada a servicio
    this.serverService.graphql(body)
      .subscribe(res => {
        console.log(res);
        this.categoriesArray.push(res['data']['createCategory']);
      });
  }



  createCompetitor(form) {
    const body = {
      query: `mutation {
        createCompetitor(input: {
          firstName: "${form.firstName}",
          lastName:"${form.lastName}" ,
          athlete: ${form.athlete},
          personalId: ${form.personalId},
          age: ${form.age},
          gender: "${form.gender}",
          city: "${form.city}",
          categories:${form.categories},
          email: "${form.email}",
          phone: ${form.phone},
        }) {
          firstName
          lastName
          athlete
          personalId
          age
          gender
          categories
        }
      }`
    }

    // Llamada a servicio
    this.serverService.graphql(body)
      .subscribe(res => {
        if(res['data']){
          console.log(res);
          this.categoriesArray.push(res['data']['createCompetitor']);
        } else {
          return
        }
        return
      });
  }
}

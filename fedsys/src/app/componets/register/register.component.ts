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

  public categoriesArray = [
    {  categoryNumber: 1,
      categoryName:'Fisico Culturismo'
    },
    {
      categoryNumber: 2,
      categoryName:'Bikini'
    },
    {
      categoryNumber: 3,
      categoryName: 'Fisicoculturismo junior'
    },
    {
      categoryNumber: 4,
      categoryName: 'Bikini Masculino'
    }
  ];
  constructor(
    private serverService: ServiceService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    // console.log(this.categoriesArray)
    // const body = {
    //   mutation:` {
    //     category{
    //       number:,
    //       name:,
    //     }
    //   }`
    // };
    // this.serverService.graphql(body)
    // .subscribe(res => {
    //   console.log(res);
    //   this.categoriesArray.push(res);
    // });
  }

  addCategory() {

    const dialogRef = this.dialog.open(RegCategoriesComponent, {
      width: '50%',
      data: this.categoriesArray
    });
    // console.log('hello' + dialogRef.data);
    dialogRef.afterClosed().subscribe(result => {
        console.log("Dialog output:", result)
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
}

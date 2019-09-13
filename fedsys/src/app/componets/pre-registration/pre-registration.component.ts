import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material";
import { ServiceService } from 'src/app/service.service';

import { RegCategoriesComponent } from '../register/reg-categories/reg-categories.component';
import { RegTourneyComponent } from '../register/reg-tourney/reg-tourney.component';
@Component({
  selector: 'app-pre-registration',
  templateUrl: './pre-registration.component.html',
  styleUrls: ['./pre-registration.component.css']
})
export class PreRegistrationComponent implements OnInit {
  public tourneyType = []
  public categoriesArray = [
    // {  number: 1,
    //   name:'Fisico Culturismo'
    // },
    // {
    //   number: 2,
    //   name:'Bikini'
    // },
    // {
    //   number: 3,
    //   name: 'Fisicoculturismo junior'
    // },
    // {
    //   number: 4,
    //   name: 'Bikini Masculino'
    // }
  ];

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

    addTourneyType() {

    const dialogRef = this.dialog.open(RegTourneyComponent, {
      width: '50%',
      data: this.categoriesArray
    });
    // console.log('hello' + dialogRef.data);
    dialogRef.afterClosed().subscribe(result => {
        console.log("Dialog output:", result);
        this.tourneyType.push(result);
      });
  };

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
  };
}

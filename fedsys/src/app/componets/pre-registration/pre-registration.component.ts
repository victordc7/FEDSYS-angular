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
  public tourneyType = [];
  public categoriesArray = [];
  public subcategoriesArray = [];
  private body;

  constructor(
    private serverService: ServiceService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.body = {
      query:` query {
        categories
        { _id
          name
        },
        subcategories
        { _id
          name
        },
        tourneyTypes{
          number
          name
          _id
          subcategories{name}
        }

      }`
    };

    this.serverService.graphql(this.body)
    .subscribe(res => {
      console.log(res);
      this.categoriesArray.push(res['data']['categories']);
      this.subcategoriesArray.push(res['data']['subcategories']);
      this.tourneyType.push(res['data']['tourneyTypes']);
      console.log(this.categoriesArray[0])
    });
  }


  addCategory() {

    const dialogRef = this.dialog.open(RegCategoriesComponent, {
      width: '50%',
      data: this.categoriesArray[0]
    });
    // console.log('hello' + dialogRef.data);
    dialogRef.afterClosed().subscribe(result => {
        console.log("Dialog output:", result);
        if (result.level === 'Sub-category'){
          this.createSubcategory(result);
        } else {
          this.createCategory(result);
        }
      });
  }

  addTourneyType() {

    const dialogRef = this.dialog.open(RegTourneyComponent, {
      width: '50%',
      data: this.subcategoriesArray[0]
    });
    // console.log('hello' + dialogRef.data);
    dialogRef.afterClosed().subscribe(result => {
        console.log("Dialog output:", result);
        this.createTourneyType(result);
      });
  };

  createSubcategory(form) {
    this.body = {
      query: `mutation {
        createSubcategory(input: {
          name: "${form.name}"
          parent: "${form.parent}"
        }) {
          _id
          name
        }
      }`
    };
    console.log('fuera  del request')
    // Llamada a servicio
    this.serverService.graphql(this.body)
    .subscribe(res => {
      console.log("dentro del request")
      console.log(res);
      this.subcategoriesArray[0].push(res['data']['createSubcategory']);
    });
  }

  createCategory(form) {
    this.body = {
      query: `mutation {
        createCategory(input: {
          name: "${form.name}"
        }) {
          name
        }
      }`
    };

    // Llamada a servicio
    this.serverService.graphql(this.body)
    .subscribe(res => {
      console.log(res);
      this.categoriesArray[0].push(res['data']['createCategory']);

    });
  }

  deleteItem(index, item){

    if(item === 'tourney'){
      const tourneyID = this.tourneyType[0][index]["_id"];

      this.body = {
        query: ` mutation {
          deleteTourneyType(_id:"${tourneyID}"){
            _id
            name
          }
        }`
      };

    } else if(item==='category'){
      const categoryID = this.categoriesArray[0][index]["_id"];

      this.body = {
        query: ` mutation {
          deleteCategory(_id:"${categoryID}"){
            _id
            name
          }
        }`
      };
    }

    // Llamada a servicio
    this.serverService.graphql(this.body)
    .subscribe(res => {
      console.log(res);
      if(res['errors']){
        return;
      }
      if(item === 'tourney'){
        this.tourneyType[0].splice(index, 1);
      } else
      if(item === 'category'){
        this.categoriesArray[0].splice(index, 1);
      }
    });
  }

  createTourneyType(form){
    this.body = {
      query: `mutation {
        createTourneyType(input: {
          number: ${form.number}
          name:"${form.name}"
          subcategories: "${form.categories}"
        }){
          number
          name
          subcategories{name,parent{name}}
        }
      }`
    }
     // Llamada a servicio
     this.serverService.graphql(this.body)
     .subscribe(res => {
       console.log(res);
       if(res['errors']){
         return;
       }
       this.tourneyType[0].push(res['data']['tourneyType']);
     });
  }
}

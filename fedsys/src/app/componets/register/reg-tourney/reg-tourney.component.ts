import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

import { ServiceService } from 'src/app/service.service';
import { TourneyType } from 'src/app/models/tourney-type.model';

@Component({
  selector: 'app-reg-tourney',
  templateUrl: './reg-tourney.component.html',
  styleUrls: ['./reg-tourney.component.css']
})
export class RegTourneyComponent implements OnInit {
  tourneyRegistrationForm: FormGroup;
  public body;
  public subcategoriesArray = [];
  constructor(
    private serverService: ServiceService,
    private dialogRef: MatDialogRef<RegTourneyComponent>,
    @Inject(MAT_DIALOG_DATA) public dataInput
  ) { }


  ngOnInit() {
    this.body = {
      query:` query {
        subcategories
        { _id
          name
          parent
          { _id
            name
          }
        }
      }`
    };
    this.serverService.graphql(this.body)
    .subscribe(res => {
      this.subcategoriesArray.push(res['data']['subcategories']);
    });

          /**
      * Form creation and class variables initialization
      */
    this.tourneyRegistrationForm =  new FormGroup({
      'number': new FormControl(null,[Validators.required]),
      'name': new FormControl(null,[Validators.required]),
      'categories': new FormArray([],[Validators.required]),
    });

    this.tourneyRegistrationForm.setValue({
      'number': '',
      'name': '',
      'categories':[]
    });

    this.tourneyRegistrationForm.valueChanges.subscribe(
    (value) => console.log(value)
    );
  }
     /**
   * Creates request body object from course competitor form instance
   * @returns requestBody - Object with the required data for course application requests
   */
  private getRequestBody(): any {
    const result: TourneyType = Object.assign({}, this.tourneyRegistrationForm.value);
    const requestBody: Object = {

      number: result.number,
      name: result.name,
      categories: result.categories
    };
    console.log("Here the competitor object" + requestBody)
    return requestBody;
  }

  onAddCategory() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.tourneyRegistrationForm.get('categories')).push(control);
  }

  onDeleteCategory(index: number) {
    (<FormArray>this.tourneyRegistrationForm.get('categories')).removeAt(index);
  }

  onSubmit() {
    const form = this.getRequestBody();
    console.log(form);
    console.log(this.tourneyRegistrationForm);
    let subcategories = "["
    form.categories.map(subcategory => {
      subcategories = subcategories + '"' + subcategory + '",';
    });
    subcategories = subcategories + "]";
    console.log('SUBCATEGORIES');
    console.log(subcategories);

    if (this.tourneyRegistrationForm.status === 'VALID'){
      if (this.dataInput === "Add tourney") {
        const body = {
          query: `mutation {
            createTourneyType(input: {
              number: ${form.number}
              name: "${form.name}"
              subcategories: ${subcategories}
            }){
              number
              name
              subcategories{
                name
                parent{name}
              }
            }
          }`
        };
        console.log(body);
        // Llamada a servicio
        this.serverService.graphql(body)
          .subscribe(res => {
            console.log(res);
            this.dialogRef.close(form);
            this.tourneyRegistrationForm.reset();
          });
        } else if (this.dataInput['name'] !== undefined) {
        this.dialogRef.close(form);
        this.tourneyRegistrationForm.reset();
      }
    }
  }

  close():void {
    // if (this.tourneyRegistrationForm.status === 'VALID'){
      this.dialogRef.close();
    // }
  }

}

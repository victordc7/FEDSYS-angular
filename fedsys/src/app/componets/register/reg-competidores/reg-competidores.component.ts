import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from "@angular/material";

import { Competitor } from '../../../models/competitor.model';
import { ServiceService } from 'src/app/service.service';
import { RegNewCompetitorsComponent } from '../reg-new-competitors/reg-new-competitors.component';

@Component({
  selector: 'app-reg-competidores',
  templateUrl: './reg-competidores.component.html',
  styleUrls: ['./reg-competidores.component.css']
})

export class RegCompetidoresComponent implements OnInit {
  competitorRegistrationForm: FormGroup;
  genders = ['male', 'female'];
  public categoriesArray = [];
  public competitorsArray = [];
  public competitorToModify: {
    firstName: string,
    lastName: string,
    personalID: number,
    age: number,
    gender: string,
    city: string,
    categories:[],
    email: string,
    phone: string,
  };

  constructor(
    private serverService: ServiceService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<RegCompetidoresComponent>,
    @Inject(MAT_DIALOG_DATA) public dataInput
  ) {}

  ngOnInit() {
    console.log(this.dataInput)
    const body = {
      query:` query {
        competitors
        { _id
          firstName
        },
        subcategories
        { _id
          name
          parent {
            _id
            name
          }
        }
      }`
    };

    // Initialize competitors
    this.serverService.graphql(body)
    .subscribe(res => {
      this.competitorsArray.push(res['data']['competitors']);
      this.categoriesArray.push(res['data']['subcategories']);
      console.log(this.categoriesArray)
    });
    /**
    * Form creation and class variables initialization
    */
    this.competitorRegistrationForm =  new FormGroup({
        'firstName': new FormControl(null),
        'lastName': new FormControl(null),
        'personalID': new FormControl(null),
        'age': new FormControl(null),
        'gender': new FormControl('male'),
        'city': new FormControl(null),
        'categories': new FormArray([]),
        'email': new FormControl(null),
        'phone': new FormControl(null)
      });

    this.competitorRegistrationForm.setValue({
        'firstName': '',
        'lastName': '',
        'personalID': '',
        'age': '',
        'gender': '',
        'city': '',
        'categories':[],
        'email': '',
        'phone': '',
    });

    this.competitorRegistrationForm.valueChanges.subscribe(
      (value) => console.log(value)
    );
    this.setFormControlsValidators();

    if(this.dataInput === 'Add competitor') {
      console.log('Subcategory!!!');
      } else if (this.dataInput['firstName'] !== undefined) {
       console.log('Competitor modification!!!');
       this.competitorToModify = this.dataInput;
       this.fillForm(this.competitorToModify);
    }
  }

  private setFormControlsValidators() {
    const numberRegEx = /^[0-9]+$/;
    const nameRegEx = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    Object.keys(this.competitorRegistrationForm.controls).forEach(key => {
      /* We mark all form fields but org as required since all of them are required :) */
      if (key === 'email') {
        const validators = [];
        validators.push(Validators.pattern(emailRegEx));
      }
      if (key !== 'email' && key !== 'phone') {
        const validators = [Validators.required];
        if (key === 'firstName' || key === 'lastName' ||
                   key === 'city' || key === '') {
          validators.push(Validators.pattern(nameRegEx));
        } else if (key === 'personalID') {
          validators.push(Validators.pattern(numberRegEx));
        }
        this.competitorRegistrationForm.get(key).setValidators(validators);
      }
    });
  }

     /**
   * Creates request body object from course competitor form instance
   * @returns requestBody - Object with the required data for course application requests
   */
  private getRequestBody(): any {
    const result: Competitor = Object.assign({}, this.competitorRegistrationForm.value);
    const requestBody: Object = {
      firstName: result.firstName,
      lastName: result.lastName,
      personalID: result.personalID,
      age: result.age,
      gender: result.gender,
      city: result.city,
      categories: result.categories,
      email: result.email,
      phone: result.phone
    };
    console.log("Here the competitor object" + requestBody)
    return requestBody;
  }

  newCompetitor() {

    const dialogRef = this.dialog.open(RegNewCompetitorsComponent, {
      width: '50%',
      data: this.competitorsArray[0]
    });
    // console.log('hello' + dialogRef.data);
    dialogRef.afterClosed().subscribe(res => {
      console.log("Dialog output:", res);
      if (res === undefined) {
        return;
      } else {
        // this.competitorsArray.push(result);
        this.fillForm(res);
        // this.serverService.graphql(this.body).subscribe(res => console.log(res));
      }
    });
  }

  fillForm(form) {
    this.competitorRegistrationForm.setValue({
      'firstName': `${form.firstName}`,
      'lastName': `${form.lastName}`,
      'personalID': `${form.personalID}`,
      'age': `${form.age}`,
      'gender': `${form.gender}`,
      'city': `${form.city}`,
      'categories':[],
      'email': `${form.email}`,
      'phone': `${form.phone}`,
    });
  }

  onAddCategory() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.competitorRegistrationForm.get('categories')).push(control);
  }

  onDeleteCategory(index: number) {
    (<FormArray>this.competitorRegistrationForm.get('categories')).removeAt(index);
  }

  onSubmit() {
    const form = this.getRequestBody();
    console.log(form);
    console.log(this.competitorRegistrationForm);

    if (this.competitorRegistrationForm.status === 'VALID'){
          this.dialogRef.close(form);
          this.competitorRegistrationForm.reset();
        }

    return ;
  }

  close():void {
    if (this.competitorRegistrationForm.status === 'VALID'){
      this.dialogRef.close();
    }
  }
}

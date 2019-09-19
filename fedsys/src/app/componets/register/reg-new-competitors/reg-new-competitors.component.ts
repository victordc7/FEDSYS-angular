import { Component, OnInit, Inject  } from '@angular/core';
import { FormControl, FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

import { Competitor } from '../../../models/competitor.model';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-reg-new-competitors',
  templateUrl: './reg-new-competitors.component.html',
  styleUrls: ['./reg-new-competitors.component.css']
})
export class RegNewCompetitorsComponent implements OnInit {
  competitorRegistrationForm: FormGroup;
  genders = ['male', 'female'];
  public submit =false;
  constructor(
    private serverService: ServiceService,
    private dialogRef: MatDialogRef<RegNewCompetitorsComponent>,
    @Inject(MAT_DIALOG_DATA) public competitorsArray
  ) { }

  ngOnInit() {
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
      'email': '',
      'phone': '',
     });

    this.competitorRegistrationForm.statusChanges.subscribe(
      (value) => {this.submit = (value === 'VALID') ? true : false; }
    );
    this.setFormControlsValidators();

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

  onSubmit() {
    const form = this.getRequestBody();
    console.log(form);
    console.log(this.competitorRegistrationForm);

    if (this.competitorRegistrationForm.status === 'VALID'){
      const body = {
        query: `mutation {
          createCompetitor(input: {
            firstName: "${form.firstName}",
            lastName:"${form.lastName}" ,
            personalID: ${form.personalID},
            age: ${form.age},
            gender: "${form.gender}",
            city: "${form.city}",
            email: "${form.email}",
            phone: "${form.phone}",
          }) {
            firstName
            lastName
            personalID
            age
            gender
            city
            email
            phone
          }
        }`
      };
      // Llamada a servicio
      this.serverService.graphql(body)
        .subscribe(res => {
          this.dialogRef.close(form);
          this.competitorRegistrationForm.reset();
        });
      }
    return ;
  }

  close():void {
    if (this.competitorRegistrationForm.status === 'VALID'){
      this.dialogRef.close();
    }

  }
}

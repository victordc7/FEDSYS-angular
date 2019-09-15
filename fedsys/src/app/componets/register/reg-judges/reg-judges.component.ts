import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup,  Validators } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

import { Judge } from '../../../models/judge.model';


@Component({
  selector: 'app-reg-judges',
  templateUrl: './reg-judges.component.html',
  styleUrls: ['./reg-judges.component.css']
})
export class RegJudgesComponent implements OnInit {
  judgesRegistrationForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<RegJudgesComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
      const body = {
        query:` {
          categories
        }`
      }

    // this.categoriesArray =  this.serverService.graphql(body).subscribe(res => console.log(res));

      /**
    * Form creation and class variables initialization
    */
    this.judgesRegistrationForm =  new FormGroup({
        'firstName': new FormControl(null),
        'lastName': new FormControl(null),
        'personalId': new FormControl(null),
        'email': new FormControl(null),
        'age': new FormControl(null),
        'city': new FormControl(null),
        'charge': new FormControl(null)
      });

    this.judgesRegistrationForm.setValue({
      'firstName': '',
      'lastName': '',
      'personalId': '',
      'email': '',
      'age': '',
      'city': '',
      'charge': '',
    });

    this.judgesRegistrationForm.valueChanges.subscribe(
      (value) => console.log(value)
    );
    this.setFormControlsValidators();
  }

  private setFormControlsValidators() {
    const numberRegEx = /^[0-9]+$/;
    const nameRegEx = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    Object.keys(this.judgesRegistrationForm.controls).forEach(key => {
      /* We mark all form fields but org as required since all of them are required :) */
      if (key === 'email') {
        const validators = [];
        validators.push(Validators.pattern(emailRegEx));
      }
      if (key !== 'email') {
        const validators = [Validators.required];
        if (key === 'firstName' || key === 'lastName' ||
                  key === 'city' || key === 'charge') {
          validators.push(Validators.pattern(nameRegEx));
        } else if (key === 'personalId') {
          validators.push(Validators.pattern(numberRegEx));
        }
        this.judgesRegistrationForm.get(key).setValidators(validators);
      }
    });
  }
       /**
   * Creates request body object from course competitor form instance
   * @returns requestBody - Object with the required data for course application requests
   */
  private getRequestBody(): any {
    const result: Judge = Object.assign({}, this.judgesRegistrationForm.value);
    const requestBody: Object = {
      firstName: result.firstName,
      lastName: result.lastName,
      personalId: result.personalId,
      email: result.email,
      age: result.age,
      city: result.city,
      charge: result.charge
    };
    console.log("Here the competitor object" + requestBody);
    return requestBody;
  }

  onSubmit() {
    const form = this.getRequestBody();
    console.log(form);
    console.log(this.judgesRegistrationForm);

    if (this.judgesRegistrationForm.status === 'VALID'){
      const body = {
        mutation: ` {
          createUser(input: {
            firstName: ${form.firstName},
            lastName:${form.lastName} ,
            personalId: ${form.personalId},
            email: ${form.email},
            age: ${form.age},
            city: ${form.city},
            charge: ${form.charge},
          })
        }`
      }
      // this.serverService.graphql(body)
      //   .subscribe(res => {console.log(res)})
      this.dialogRef.close(form);
      this.judgesRegistrationForm.reset();
    }

    return;
  }

  close(): void {
  this.dialogRef.close();
  }
}

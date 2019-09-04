import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CompetitorModel } from '../../models/competitor.model';

@Component({
  selector: 'app-reg-competidores',
  templateUrl: './reg-competidores.component.html',
  styleUrls: ['./reg-competidores.component.css']
})
export class RegCompetidoresComponent implements OnInit {
competitorRegistrationForm: FormGroup;
genders = ['male', 'female'];

  constructor(
    // public _CompetitorService: CompetitorService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    /**
  * Form creation and class variables initialization
  */
 this.competitorRegistrationForm =  new FormGroup({
  'firstName': new FormControl(null),
  'lastName': new FormControl(null),
  'athlete': new FormControl(null),
  'id': new FormControl(null),
  'age': new FormControl(null),
  'gender': new FormControl('male'),
  'city': new FormControl(null),
  'email': new FormControl(null),
  'phone': new FormControl(null)
  // categories: result.categories
 });

 this.competitorRegistrationForm.setValue({
  'firstName': '',
  'lastName': '',
  'athlete': '',
  'id': '',
  'age': '',
  'gender': '',
  'city': '',
  'email': '',
  'phone': '',
  // categories: result.categories
 });

 this.competitorRegistrationForm.valueChanges.subscribe(
  (value) => console.log(value)
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
        } else if (key === 'id') {
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
    const result: CompetitorModel = Object.assign({}, this.competitorRegistrationForm.value);
    const requestBody: Object = {
      firstName: result.firstName,
      lastName: result.lastName,
      athlete: result.athlete,
      id: result.idNumber,
      age: result.age,
      gender: result.gender,
      city: result.city,
      email: result.email,
      phone: result.phone
      // categories: result.categories
    };
    console.log("Here the competitor object" + requestBody)
    return requestBody;
  }
  onSubmit() {
    const form = this.getRequestBody();
    console.log(form);
    console.log(this.competitorRegistrationForm);

    if (this.competitorRegistrationForm.status === 'VALID'){
          // Llamada a servicio
          this.competitorRegistrationForm.reset();
        }

    return ;
  }
}

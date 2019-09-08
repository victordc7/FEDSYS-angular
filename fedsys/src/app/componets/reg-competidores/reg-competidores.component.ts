import { Component, OnInit } from '@angular/core';
import { FormControl, FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Competitor } from '../../models/competitor.model';
import { Category } from '../../models/category.model';
import { ServiceService } from 'src/app/service.service';
import { CompetitorService } from 'src/app/services/competitor.service';

@Component({
  selector: 'app-reg-competidores',
  templateUrl: './reg-competidores.component.html',
  styleUrls: ['./reg-competidores.component.css']
})

export class RegCompetidoresComponent implements OnInit {
  competitorRegistrationForm: FormGroup;
  genders = ['male', 'female'];
  select = '-- Select a category/Elija una categoría --';

  // private categoriesArray: Category[] = []

  private categoriesArray: Category[] = [
    new Category(
      1,
      'Fisico Culturismo',
      1,
      null
    ),
    new Category(
      2,
      'Bikini',
      1,
      null
    ),
    new Category(
      3,
      'Fisicoculturismo junior',
      2,
      1
    ),
    new Category(
      4,
      'Bikini Masculino',
      2,
      2
    )
  ];


  constructor(
    private  competitorService: CompetitorService,
    private formBuilder: FormBuilder,
    private serverService: ServiceService
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
 this.competitorRegistrationForm =  new FormGroup({
    'firstName': new FormControl(null),
    'lastName': new FormControl(null),
    'athlete': new FormControl(null),
    'id': new FormControl(null),
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
  'athlete': '',
  'id': '',
  'age': '',
  'gender': '',
  'city': '',
  'categories':[],
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
    const result: Competitor = Object.assign({}, this.competitorRegistrationForm.value);
    const requestBody: Object = {
      firstName: result.firstName,
      lastName: result.lastName,
      athlete: result.athlete,
      id: result.idNumber,
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
          // Llamada a servicio
          this.competitorService.addCompetitor(form);
          this.competitorRegistrationForm.reset();
        }

    return ;
  }


}

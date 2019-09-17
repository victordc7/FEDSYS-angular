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

  constructor(
    private serverService: ServiceService,
    private dialogRef: MatDialogRef<RegTourneyComponent>,
    @Inject(MAT_DIALOG_DATA) public subcategoriesArray
  ) { }


  ngOnInit() {
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

    if (this.tourneyRegistrationForm.status === 'VALID'){

          this.dialogRef.close(form);
          this.tourneyRegistrationForm.reset();
        }

    return ;
  }

  close():void {
    // if (this.tourneyRegistrationForm.status === 'VALID'){
      this.dialogRef.close();
    // }
  }

}

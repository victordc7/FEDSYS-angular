import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

import { Category } from '../../../models/category.model';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-reg-categories',
  templateUrl: './reg-categories.component.html',
  styleUrls: ['./reg-categories.component.css']
})
export class RegCategoriesComponent implements OnInit {
  categoryRegistrationForm: FormGroup;
  categoryTypes = ['Category', 'Sub-category'];

  constructor(
    private serverService: ServiceService,
    private dialogRef: MatDialogRef<RegCategoriesComponent>,
    @Inject(MAT_DIALOG_DATA) public categoriesArray) {
      console.log(categoriesArray)
      // this.descripcion =  data.titulo;
      // console.log(this.descripcion);
    }

  ngOnInit() {

    /**
    * Form creation and class variables initialization
    */
    this.categoryRegistrationForm = new FormGroup({
      'name': new FormControl(null, [Validators.required]),
      'level': new FormControl('Category'),
      'parent': new FormControl(null)
    });
    this.categoryRegistrationForm.setValue({
      'name': '',
      'level': 'Category',
      'parent': ''
    });
    this.categoryRegistrationForm.patchValue({
      'level': 'Category'
    });
    this.categoryRegistrationForm.valueChanges.subscribe(
      (value) => console.log(value)
    );
  }

   /**
   * Creates request body object from course contact form instance
   * @returns requestBody - Object with the required data for course application requests
   */
  private getRequestBody(): any {
    const result: Category = Object.assign({}, this.categoryRegistrationForm.value);
    const requestBody: Object = {
      name: result.name,
      level: result.level,
      parent: result.parent || null
    };
    return requestBody;
  }


  onSubmit() {
    const form = this.getRequestBody();
    console.log(form);
    console.log(this.categoryRegistrationForm);

    if (this.categoryRegistrationForm.status === 'VALID'){

          this.dialogRef.close(form);
          this.categoryRegistrationForm.reset();
        }

    return ;
  }

  close():void {
    this.dialogRef.close();
  }

}

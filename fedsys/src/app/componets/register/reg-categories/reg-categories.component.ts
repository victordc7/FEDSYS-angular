import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-reg-categories',
  templateUrl: './reg-categories.component.html',
  styleUrls: ['./reg-categories.component.css']
})
export class RegCategoriesComponent implements OnInit {
  categoryRegistrationForm: FormGroup;
  categoryTypes = ['Category', 'Sub-category'];
  public categoriesArray = [];
  public subcategoriesArray = [];

  // Subcategory addition: true, Category creation: false
  public action: boolean;

  constructor(
    private dialogRef: MatDialogRef<RegCategoriesComponent>,
    @Inject(MAT_DIALOG_DATA) public dataInput) {
      this.categoriesArray = dataInput[0];
      this.subcategoriesArray = dataInput[1];
      this.action = (this.dataInput[2] === 'add') ? true : false;
    }

  ngOnInit() {

    /**
    * Form creation and class variables initialization
    */
    this.categoryRegistrationForm = new FormGroup({
      'name': new FormControl(null, [Validators.required]),
      'code': new FormControl(null),
      'level': new FormControl('Category'),
      'parent': new FormControl(null)
    });
    this.categoryRegistrationForm.setValue({
      'name': '',
      'code': '',
      'level': 'Category',
      'parent': ''
    });
    if (this.dataInput[2] === 'create') {
      this.categoryRegistrationForm.patchValue({
        'level': 'Category'
      });
    } else if (this.dataInput[2] === 'add'){
      this.categoryRegistrationForm.patchValue({
        'level': 'Sub-category'
      });
    }
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
    console.log(result)
    result.parent = this.action ? this.categoryRegistrationForm.value.name.parent.name : result.parent;
    const requestBody: Object = {
      name: result.name,
      code: this.categoryRegistrationForm.value.name.code,
      level: result.level,
      parent: result.parent || null
    };
    return requestBody;
  }


  onSubmit() {
    const form = this.getRequestBody();
    console.log(form);
    console.log(this.categoryRegistrationForm);

    if (this.categoryRegistrationForm.status === 'VALID') {
          this.dialogRef.close(form);
          this.categoryRegistrationForm.reset();
        }
    return ;
  }

  close():void {
    this.dialogRef.close();
  }

}

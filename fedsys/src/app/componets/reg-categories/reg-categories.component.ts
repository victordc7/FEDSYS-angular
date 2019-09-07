import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Category } from '../../models/category.model';

@Component({
  selector: 'app-reg-categories',
  templateUrl: './reg-categories.component.html',
  styleUrls: ['./reg-categories.component.css']
})
export class RegCategoriesComponent implements OnInit {
  categoryRegistrationForm: FormGroup;
  categoryTypes = ['Category', 'Sub-category'];
  constructor(
    // public _categoryService: CategoryService,
    private  formBuilder: FormBuilder,
  ) { }

  ngOnInit() {

  /**
  * Form creation and class variables initialization
  */
    this.categoryRegistrationForm = new FormGroup({
      'categoryNumber': new FormControl(null, [Validators.required]),
      'categoryName': new FormControl(null, [Validators.required]),
      'categoryLevel': new FormControl('Category')
    });
    this.categoryRegistrationForm.setValue({
      'categoryNumber': '',
      'categoryName': '',
      'categoryLevel': 'Category'
    });
    this.categoryRegistrationForm.patchValue({
      'categoryLevel': 'Category'
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
      categoryNumber: result.categoryNumber,
      categoryName: result.categoryName,
      categoryLevel: result.categoryLevel,
      categoryParent: result.categoryParent || null
    };
    return requestBody;
  }


  onSubmit() {
    const form = this.getRequestBody();
    console.log(form);
    console.log(this.categoryRegistrationForm);

    if (this.categoryRegistrationForm.status === 'VALID'){
          // Llamada a servicio
          this.categoryRegistrationForm.reset();
        }

    return ;
  }

}

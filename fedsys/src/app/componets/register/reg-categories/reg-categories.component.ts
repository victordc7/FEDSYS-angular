import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
    // public _categoryService: CategoryService,
    private  formBuilder: FormBuilder,
    private serverService: ServiceService,
    private dialogRef: MatDialogRef<RegCategoriesComponent>,
    @Inject(MAT_DIALOG_DATA) public categoriesArray) {
      // console.log(data)
      // this.descripcion =  data.titulo;
      // console.log(this.descripcion);
    }

  ngOnInit() {

    /**
    * Form creation and class variables initialization
    */
    this.categoryRegistrationForm = new FormGroup({
      'number': new FormControl(null, [Validators.required]),
      'name': new FormControl(null, [Validators.required]),
      'level': new FormControl('Category'),
      'parent': new FormControl(null)
    });
    this.categoryRegistrationForm.setValue({
      'number': '',
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
      number: result.number,
      name: result.name,
      level: result.level,
      parent: result.parent || null
    };
    return requestBody;
  }


  onSubmit() {
    const form = this.getRequestBody();
    const body = {
      mutation:` {
        createCategory(input: {
          number: ${form.number},
          name: ${form.name},
          level: ${form.level},
          parent: ${form.parent}
        }) {
          number:,
          name:,
        }
      }`
    }
    console.log(form);
    console.log(this.categoryRegistrationForm);

    if (this.categoryRegistrationForm.status === 'VALID'){
          // Llamada a servicio

          // this.serverService.graphql(body)
          //   .subscribe(res => {
          //     console.log(res);
          //     this.categoriesArray.push(res);
          //   });
          this.categoryRegistrationForm.reset();
        }

    return ;
  }

  close():void {
    this.dialogRef.close();
  }

}

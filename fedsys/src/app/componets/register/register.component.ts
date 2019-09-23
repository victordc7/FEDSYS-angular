import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from "@angular/material";
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';

import { ServiceService } from 'src/app/service.service';
import { RegCategoriesComponent } from './reg-categories/reg-categories.component';
import { RegCompetidoresComponent } from './reg-competidores/reg-competidores.component';
import { RegJudgesComponent } from './reg-judges/reg-judges.component';
import { StartingOrderComponent } from './starting-order/starting-order.component';
// import { ConnectedPositionStrategy } from '@angular/cdk/overlay';

/**
 * Category data with nested structure.
 * Each node has a name and an optiona list of children.
 */
interface CategoryNode {
  name: string;
  _id: string;
  children?: Array<CategoryNode>;
}

/** Flat node with expandable and level information */
interface CategoryFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})


export class RegisterComponent implements OnInit {
  @Input() tournamentType;
  public tourneyRegistrationForm: FormGroup;
  private body;

  // Global database categories and subcategories
  public categoriesArray = [];
  public subcategoriesArray = [];

  // Local variables for the tourney
  public categories = [];
  public subcategories = [];
  public competitors = [];
  public judges = [];
  public categoryTree: Array<CategoryNode> = [
    // {_id: '', name: 'Fisicoculturismo', children: [{_id: '', name: '20Kg'}, {_id: '', name: '40Kg'}]},
    // {_id: '', name: 'Musculatura', children: [{_id: '', name: 'Hipertrofia'}]},
    // {_id: '', name: 'Fitness', children: [{_id: '', name: 'top'}]},
    // {_id: '', name: 'Peso', children: [{_id: '', name: '20Kg'}]}
  ];

  /**
   * Category Tree, buildinng initialization
  */
  dataChange = new BehaviorSubject<CategoryNode[]>([]);

  get data(): CategoryNode[] { return this.dataChange.value; }

  private _transformer = (node: CategoryNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<CategoryFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);


  constructor(
    private serverService: ServiceService,
    public dialog: MatDialog,

  ) {
    this.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    const data = this.buildFileTree(this.categoryTree, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  buildFileTree(obj: {[key: string]: any}, level: number): CategoryNode[] {
    return Object.keys(obj).reduce<CategoryNode[]>((accumulator, key) => {
      const value = obj[key];
      const node: CategoryNode = {_id: '', name: '', children: []};
      node.name = value.name;

      if (value != null) {
        if (typeof value === 'object') {
        // if (value['children'] !== undefined) {
          node.children = value.children;
          // node.name = value.name;
          // node.children = this.buildFileTree(value, level + 1);
        } else {
          node.name = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  hasChild = (_: number, node: CategoryFlatNode) => node.expandable;

  ngOnInit() {
    /**
    * Form creation and class variables initialization
    */
   this.tourneyRegistrationForm = new FormGroup({
    'name': new FormControl(null, [Validators.required]),
    'type': new FormControl(null, [Validators.required]),
    });
    this.tourneyRegistrationForm.valueChanges.subscribe(
      (value) => console.log(value)
    );

    /**
    * Selected tournamen type initialization
    */
    if (this.tournamentType.subcategories.length > 1) {
      this.subcategories.push(this.tournamentType['subcategories']);
    }

    /**
    * Initial request body
    */
   this.body = {
      query: ` query {
        categories
        { _id
          name
        },
        subcategories
        { _id
          name
          parent{
            _id
            name
          }
        }
      }`
    };

    // Initialize categories and subcategories
    this.serverService.graphql(this.body)
    .subscribe(res => {
      console.log(res);
      res['data']['categories'].forEach(element => {
        element.children = [];
      });
      this.categoriesArray.push(res['data']['categories']);
      this.subcategoriesArray.push(res['data']['subcategories']);
      this.categoryTree = Object.assign({}, this.categoriesArray[0]);
      this.initialize();
      for (let i = 0; i < Object.keys(this.categoryTree).length; i++) {
        for (let j = 0; j < Object.keys(this.subcategories[0]).length; j++) {
          console.log(this.subcategories[0][j]['parent']);
          if (this.categoryTree[i]['_id'] === this.subcategories[0][j]['parent']['_id']) {
            this.categoryTree[i]['children'].push({_id: null, name: this.subcategories[0][j]['name']});
            console.log(this.categoryTree);
          }
        }
      }
      this.dataChange.next(this.data);
    });
  }

  addCategory(action: string) {
    const dialogRef = this.dialog.open(RegCategoriesComponent, {
      width: '50%',
      data: [this.categoriesArray[0], this.subcategoriesArray[0], action]
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log("Dialog output:", res);
      if (res === undefined) {
          return;
        } else {
        if (action === "create"){
          if (res.level === 'Sub-category') {
            this.createSubcategory(res);
          } else {
            this.createCategory(res);
        }} else {
          if (res.level === 'Sub-category') {
            this.subcategories[0].push(res.name);
            console.log('Arbol de categorias');
            console.log(this.subcategories[0]);
            console.log(this.categoryTree);
            for (let i = 0; i < Object.keys(this.categoryTree).length; i++) {
              for (let j = 0; j < Object.keys(this.subcategories[0]).length; j++) {
                const lastIndex = Object.keys(this.subcategories[0]).length - 1;
                if (this.categoryTree[i]['_id'] === this.subcategories[0][lastIndex]['parent']['_id']){
                  this.categoryTree[i]['children'].push({_id: null, name: this.subcategories[0][lastIndex]['name']});
                  break;
                }
              }
            }
            this.dataChange.next(this.data);
          }
        }
      }
    });
  }

  addCompetitor() {
    const dialogRef = this.dialog.open(RegCompetidoresComponent, {
      width: '50%',
      data: 'Add competitor',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === undefined) {
        return;
      } else {
        console.log("Dialog competitor output:", res);
        // this.splitCompetitorByCategory(res);
        this.competitors.push(res);
      }
    });
  }

  addJudge() {
    const dialogRef = this.dialog.open(RegJudgesComponent, {
      width: '50%',
      data: 'Add judge'
    });
    dialogRef.afterClosed().subscribe(res => {
        if (res === undefined) {
          return;
        } else {
          this.judges.push(res);
        }
      });
  }

  selectStaringOrder() {
    const dialogRef = this.dialog.open(StartingOrderComponent, {
      width: '50%',
      data: {
        subcategories: this.subcategories,
        categories: this.categoriesArray
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === undefined) {
        return;
      } else {
        console.log(res);
      }
    });
  }

  createSubcategory(form) {
    this.body = {
      query: `mutation {
        createSubcategory(input: {
          name: "${form.name}"
          parent: "${form.parent._id}"
        }) {
          _id
          name
        }
      }`
    };
    console.log('fuera  del request')
    // Llamada a servicio
    this.serverService.graphql(this.body)
    .subscribe(res => {
      this.subcategoriesArray[0].push(res['data']['createSubcategory']);
    });
  }

  createCategory(form) {

    this.body = {
      query: `mutation {
        createCategory(input: {
          name: "${form.name}"
          parent: "${form.parent._id}"
        }) {
          _id
          name
        }
      }`
    };

    // Llamada a servicio
    this.serverService.graphql(this.body)
    .subscribe(res => {
      console.log(res);
      this.categoriesArray[0].push(res['data']['createCategory']);
    });
  }

  // creatTourney() {

  //   this.body = {
  //     query: `mutation {
  //       createTourney(input: {
  //         name: "Tipo -${this.tournamentType.name} Prueba"
  //         number: ${this.tournamentType.number}
  //         type: ${this.tournamentType._id}
  //       }) {
  //         _id
  //         name
  //         number
  //       }
  //     }`
  //   };

  //   // Llamada a servicio
  //   this.serverService.graphql(this.body)
  //   .subscribe(res => {
  //     console.log(res);

  //   });
  // }


  // splitCompetitorByCategory(form) {

  //   for (let i = 0; i < form.categories.length; i++) {
  //     const competitor = {
  //       firstName: form.firstName,
  //       lastName: form.lastName,
  //       personalId: form.personalId,
  //       age: form.age,
  //       gender: form.gender,
  //       city: form.city,
  //       category: form.categories[i],
  //       email: form.email,
  //       phone: form.phone,
  //     }
  //     this.competitors.push(competitor);
  //   }
  //   this.modifyTourney(this.competitors);
  // }

  // modifyTourney(modification) {
  //   if(modification === this.competitors){
  //     this.body = {
  //       query: `mutation {
  //         updateTourney(input: {
  //           competitors: "${modification}"
  //         }) {
  //           _id
  //           competitors
  //         }
  //       }`
  //     };
  //   } else if(modification === this.categoriesArray) {
  //     this.body = {
  //       query: `mutation {
  //         updateTourney(input: {
  //           categories: "${modification}"
  //         }) {
  //           _id
  //           categories
  //         }
  //       }`
  //     };
  //   } else if(modification === this.subcategoriesArray){
  //     this.body = {
  //       query: `mutation {
  //         updateTourney(input: {
  //           subcategories: "${modification}"
  //         }) {
  //           _id
  //           categories
  //         }
  //       }`
  //     };
  //   }
  //   // Llamada a servicio
  //   this.serverService.graphql(this.body)
  //   .subscribe(res => {
  //     console.log(res);
  //   });
  // }

  editItem(index, itemType, itemObject){
    if(itemType === 'judge'){
      const dialogRef = this.dialog.open(RegJudgesComponent, {
        width: '50%',
        data: itemObject
      });
      dialogRef.afterClosed().subscribe(res => {
          console.log("Dialog output:", res);
          if (res === undefined) {
            return;
          } else {
            this.judges[index] = res;
          }
        });
    } else
      if(itemType === 'competitor'){
      const dialogRef = this.dialog.open(RegCompetidoresComponent, {
        width: '50%',
        data: itemObject
      });
      dialogRef.afterClosed().subscribe(res => {
          console.log("Dialog output:", res);
          if (res === undefined) {
            return;
          } else {
            this.competitors[index] = res;
          }
      });
    } else
      if(itemType === 'category'){
      const dialogRef = this.dialog.open(RegCategoriesComponent, {
        width: '50%',
        data: itemObject
      });
      dialogRef.afterClosed().subscribe(res => {
          console.log("Dialog output:", res);
          if (res === undefined) {
            return;
          } else {
          // this.createJudge(result);
          }
      });
    } else if(itemType === 'subcategory'){
      const dialogRef = this.dialog.open(RegCategoriesComponent, {
        width: '50%',
        data: itemObject
      });
      dialogRef.afterClosed().subscribe(res => {
          console.log("Dialog output:", res);
          if (res === undefined) {
            return;
          } else {
            this.subcategories[index] = res;
          // this.createJudge(result);
          }
      });
    }
  }

  deleteItem(index, item){

      if(item === 'judge'){
        this.judges.splice(index, 1);
      } else
      if(item === 'competitor'){
        this.competitors.splice(index, 1);
      } else
      if(item === 'category'){
        this.categories.splice(index, 1);
      } else
      if(item === 'subcategory'){
        this.subcategories.splice(index, 1);
      }
  }
}

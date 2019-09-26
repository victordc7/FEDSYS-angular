import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material";
import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';

import { ServiceService } from 'src/app/service.service';
import { RegCategoriesComponent } from '../register/reg-categories/reg-categories.component';
import { RegTourneyComponent } from '../register/reg-tourney/reg-tourney.component';

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
  selector: 'app-pre-registration',
  templateUrl: './pre-registration.component.html',
  styleUrls: ['./pre-registration.component.css']
})
export class PreRegistrationComponent implements OnInit {
  public tourneyType = [];
  public categoriesArray = [];
  public subcategoriesArray = [];
  private body;

  public categoryTree: Array<CategoryNode> = [{_id: '', name: '', children: []}];

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
    public dialog: MatDialog
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
        } else {
          node.name = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  hasChild = (_: number, node: CategoryFlatNode) => node.expandable;

  ngOnInit() {
    this.body = {
      query:` query {
        categories
        { _id
          name
          code
        },
        subcategories
        { _id
          name
          code
          parent{
            _id
            name
            code
          }
        },
        tourneyTypes{
          number
          name
          _id
          subcategories{
            code
            name
            _id
            parent{
              _id
              name
              code
            }
          }
        }
      }`
    };
    this.serverService.graphql(this.body)
    .subscribe(res => {
      res['data']['categories'].forEach(element => {
        element.children = [];
      });
      this.categoriesArray.push(res['data']['categories']);
      this.subcategoriesArray.push(res['data']['subcategories']);
      this.tourneyType.push(res['data']['tourneyTypes']);
      this.categoryTree = Object.assign({}, this.categoriesArray[0]);
      this.initialize();
      for (let i = 0; i < Object.keys(this.categoryTree).length; i++) {
        for (let j = 0; j < Object.keys(this.subcategoriesArray[0]).length; j++) {
          if (this.categoryTree[i]['_id'] === this.subcategoriesArray[0][j]['parent']['_id']){
            this.categoryTree[i]['children'].push({_id: null, name: this.subcategoriesArray[0][j]['name']});
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
    // console.log('hello' + dialogRef.data);
    dialogRef.afterClosed().subscribe(res => {
        console.log("Dialog output:", res);
        if (res.level === 'Sub-category'){
          this.createSubcategory(res);
        } else {
          this.createCategory(res);
        }
      });
  }

  addTourneyType() {

    const dialogRef = this.dialog.open(RegTourneyComponent, {
      width: '50%',
      data: 'Add tourney'
    });
    // console.log('hello' + dialogRef.data);
    dialogRef.afterClosed().subscribe(res => {
        console.log("Dialog output:", res);
        this.updateTourney();
      });
  };

  createSubcategory(form) {
    this.body = {
      query: `mutation {
        createSubcategory(input: {
          name: "${form.name}"
          code: ${form.code}
          parent: "${form.parent._id}"
        }) {
          _id
          name
          code
          parent{
            _id
          }
        }
      }`
    };
    console.log('fuera  del request')
    // Llamada a servicio
    this.serverService.graphql(this.body)
    .subscribe(res => {
      console.log("dentro del request")
      console.log(res);
      this.subcategoriesArray[0].push(res['data']['createSubcategory']);
      for (let i = 0; i < Object.keys(this.categoryTree).length; i++) {
        for (let j = 0; j < Object.keys(this.subcategoriesArray[0]).length; j++) {
          const lastIndex = Object.keys(this.subcategoriesArray[0]).length - 1;
          if (this.categoryTree[i]['_id'] === this.subcategoriesArray[0][lastIndex]['parent']['_id']){
            this.categoryTree[i]['children'].push({_id: null, name: this.subcategoriesArray[0][lastIndex]['name']});
            break;
          }
        }
      }
      this.dataChange.next(this.data);
    });
  }

  createCategory(form) {
    this.body = {
      query: `mutation {
        createCategory(input: {
          name: "${form.name}"
          code: ${form.code}
        }) {
          _id
          name
          code
        }
      }`
    };

    // Llamada a servicio
    this.serverService.graphql(this.body)
    .subscribe(res => {
      console.log(res);
      this.categoriesArray[0].push(res['data']['createCategory']);
      this.categoryTree = Object.assign({}, this.categoriesArray[0]);
      console.log('Creo la categoria');
      console.log(this.categoryTree);
      this.dataChange.next(this.data);
    });
  }

  deleteItem(index, item){

    if(item === 'tourney'){
      const tourneyID = this.tourneyType[0][index]["_id"];

      this.body = {
        query: ` mutation {
          deleteTourneyType(_id:"${tourneyID}"){
            _id
            name
          }
        }`
      };

    } else if(item==='category'){
      const categoryID = this.categoriesArray[0][index]["_id"];
      this.body  = {
        query: `query {
          subcategoryByParentId( _id:"${categoryID}" ){
            [subcategory]
          }
        }`
      };
      // Llamada a servicio
      this.serverService.graphql(this.body)
        .subscribe(res => {
        console.log(res);
        for (let i = 0; i < res[0].length; i++) {
          this.body = {
            query: ` mutation {
              deleteSubcategory(_id:"${res[0][i]._id}"){
                _id
                name
              }
            }`
          };
          this.serverService.graphql(this.body)
            .subscribe(res => {
            console.log('Sub eliminada ' + res);
          });
        }
      });

      this.body = {
        query: ` mutation {
          deleteCategory(_id:"${categoryID}"){
            _id
            name
          }
        }`
      };
    }

    // Llamada a servicio
    this.serverService.graphql(this.body)
    .subscribe(res => {
      console.log(res);
      if(res['errors']) {
        return;
      }
      if (item === 'tourney') {
        this.tourneyType[0].splice(index, 1);
      } else
      if (item === 'category') {
        this.categoriesArray[0].splice(index, 1);
        this.categoryTree = Object.assign({}, this.categoriesArray[0]);
        this.dataChange.next(this.data);
      }
    });
  }

  updateTourney() {
    this.body = {
      query:` query {
        tourneyTypes{
          number
          name
          _id
          subcategories{
            name
            code
          }
        }
      }`
    };
    this.serverService.graphql(this.body)
    .subscribe(res => {
      console.log(res)
      this.tourneyType.push(res['data']['tourneyType']);
    });
  }
  // createTourneyType(form){

  // }
}

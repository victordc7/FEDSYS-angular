import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup,  Validators } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';

import { ServiceService } from 'src/app/service.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

/**
 * Category data with nested structure.
 * Each node has a name and an optiona list of children.
 */
interface CategoryNode {
  name: string;
  code: number;
  children?: Array<CategoryNode>;
  level: number;
  index: number;
  count?: number;
}

/** Flat node with expandable and level information */
interface CategoryFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  hasChild: boolean;
  hasChilds: boolean;
}

interface StartingOrder {
  number: number;
  subcategoryCode: number;
  fase: string;
  active: boolean;
}

@Component({
  selector: 'app-starting-order',
  templateUrl: './starting-order.component.html',
  styleUrls: ['./starting-order.component.css']
})
export class StartingOrderComponent implements OnInit {
  // Global database categories and subcategories
  public categoriesArray = [];
  public subcategoriesArray = [];

  // Local variables for the tourney
  public categories = [];
  public subcategories = [];
  public categoryTree: Array<CategoryNode> = [];

  // Variables for StartingOrder
  public orderArray: [{index:number, childrens: Array<StartingOrder>}] = [{index: 0, childrens:[]}]; 
  public orderOverallArray: Array<StartingOrder> = [];

  public previousOrder: any;

  public ready = false;

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
      index: node.index,
      count: node.count,
      hasChild: !!node.children && (node.children.length > 0 && node.children.length < 2),
      hasChilds: !!node.children && node.children.length > 1
    };
  }

  treeControl = new FlatTreeControl<CategoryFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    private serverService: ServiceService,
    private dialogRef: MatDialogRef<StartingOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public dataInput
  ) {
    this.dataChange.subscribe(data => {
      this.dataSource.data = data;
      console.log(this.dataSource);
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
      const node: CategoryNode = {code: null, name: '', children: [], level: 0, index: 0, count: 0};
      node.name = value.name;
      node.code = value.code;
      node.level = level
      node.index = value.index
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

  hasChild = (_: number, node: CategoryFlatNode) => node.hasChild;

  hasChilds = (_: number, node: CategoryFlatNode) => node.hasChilds;

  ngOnInit() {
    console.log(this.dataInput);
    this.subcategories = this.dataInput.subcategories;
    this.categoriesArray = this.dataInput.categories;
    this.subcategories[0].map(data => {
      this.categoriesArray[0].forEach(element => {
        if (element._id === data.parent._id) {
          data.parent.name = element.name;
          data.parent.code = element.code;
        }
      });
      console.log(data)
    })
    const body = {
      query: `query{
        tourneyById(_id: "${this.dataInput.tourneyId}") {
          _id
          startingOrder{
            _id
            number
            subcategoryCode
            fase
            active
          } 
        }
      }`
    };
    this.serverService.graphql(body).subscribe((res: any) => {
      this.previousOrder = res.data.tourneyById.startingOrder;
      console.log(this.previousOrder);
      this.previousOrder.sort( function (a,b) {
        if (a.subcategoryCode < b.subcategoryCode) {
          return -1;
        }
        if (a.subcategoryCode >= b.subcategoryCode) {
          return 1;
        }
      })
      let startingOrderBySubcategory = [];
      for (let i = 0; i < this.previousOrder.length; i++) {
        if (i > 0) {
          if (startingOrderBySubcategory[startingOrderBySubcategory.length - 1].code === this.previousOrder[i]['subcategoryCode']) {
            startingOrderBySubcategory[startingOrderBySubcategory.length - 1]['childrens'].push(this.previousOrder[i])
          } else {
            startingOrderBySubcategory.push({code: this.previousOrder[i]['subcategoryCode'], childrens: [this.previousOrder[i]]})
          }
        } else {
          startingOrderBySubcategory.push({code: this.previousOrder[i]['subcategoryCode'], childrens: [this.previousOrder[i]]})
        }
        
      }
      
      console.log(startingOrderBySubcategory);

      this.categoriesArray[0].map((data, index) => {
        data.index = index;
        data.children = []
      })
      this.categoryTree = Object.assign({}, this.categoriesArray[0]);
      this.initialize();

      this.orderArray.splice(0,1);
      this.subcategories[0].sort( function (a,b) {
        if (a.parent.code < b.parent.code) {
          return -1;
        }
        if (a.parent.code >= b.parent.code) {
          return 1;
        }
      })
      for (let i = 0; i < Object.keys(this.categoryTree).length; i++) {
        console.log(this.categoryTree[i]);
        this.orderOverallArray.push({number: undefined, subcategoryCode: this.categoryTree[i].code, fase: 'overall', active: false})
        for (let j = 0; j < Object.keys(this.subcategories[0]).length; j++) {
          console.log(this.subcategories[0][j]['parent']);
          for (let k = 0; k < startingOrderBySubcategory.length; k++) {
            if (this.categoryTree[i].code === startingOrderBySubcategory[k]['code']) {
              this.orderOverallArray[i] = startingOrderBySubcategory[k]['childrens'][0];
            }
            if (this.subcategories[0][j]['code'] === startingOrderBySubcategory[k]['code']) {
              this.orderArray.push({index: j, childrens: []});
              this.orderArray[j]['childrens'] = startingOrderBySubcategory[k]['childrens'];
              console.log(this.orderArray[j]);
            }
          }
          console.log(this.orderArray[j]);
          if (this.categoryTree[i]['code'] === this.subcategories[0][j]['parent']['code'] && this.orderArray[j] === undefined ) {
            this.orderArray.push({index: j, childrens: []});
            console.log(this.orderArray);
            this.orderArray[j]['childrens'].push({number: undefined, subcategoryCode: this.subcategories[0][j].code, fase: 'eliminatoria', active: false})
            this.orderArray[j]['childrens'].push({number: undefined, subcategoryCode: this.subcategories[0][j].code, fase: 'semifinal', active: false})
            this.orderArray[j]['childrens'].push({number: undefined, subcategoryCode: this.subcategories[0][j].code, fase: 'final1', active: false})
            this.orderArray[j]['childrens'].push({number: undefined, subcategoryCode: this.subcategories[0][j].code, fase: 'final2', active: false})
            this.orderArray[j]['childrens'].push({number: undefined, subcategoryCode: this.subcategories[0][j].code, fase: 'premiacion', active: false})
            console.log(this.categoryTree);
          }
          if (this.categoryTree[i]['code'] === this.subcategories[0][j]['parent']['code'] ) {
            this.categoryTree[i]['children'].push({code: this.subcategories[0][j]['code'], name: this.subcategories[0][j]['name'], level: 1, index: j, count:0});
          }
        }
        
        console.log(this.orderArray);
        this.dataInput.competitors.forEach(competitor => {
          this.categoryTree[i]['children'].forEach(subcategory => {
            if (subcategory.code === competitor.subcategory.code) {
              subcategory.count += 1;
            }
          });
        });
        this.dataChange.next(this.data);
      }
      console.log(this.orderArray);
      this.ready = true;
    })
  }

  saveChanges() {
    const fases = [];
    this.orderArray.forEach(category => {
      category.childrens.forEach(subcategory => {
        if (subcategory.number === undefined) {
          subcategory.number = 0;
        }
         fases.push(subcategory)
      });
    });
    this.orderOverallArray.forEach(category => {
      if (category.number === undefined) {
        category.number = 0;
      }
      fases.push(category)
    });
    fases.sort(function (a, b) {
      if (a.number > b.number) {
        return 1;
      }
      if (a.number < b.number) {
        return -1;
      }
      return 0;
    });
    this.dialogRef.close(fases);
    console.log(fases);
  }

  close() {
    this.dialogRef.close();
  }

}

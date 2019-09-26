import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup,  Validators } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';

import { ServiceService } from 'src/app/service.service';

/**
 * Category data with nested structure.
 * Each node has a name and an optiona list of children.
 */
interface CategoryNode {
  name: string;
  _id: string;
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

interface StaringOrder {
  number: number;
  subcategory: string;
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
  public orderArray: [{index:number, childrens: Array<StaringOrder>}] = [{index: 0, childrens:[]}]; 
  public orderOverallArray: Array<StaringOrder> = [];

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
      const node: CategoryNode = {_id: '', name: '', children: [], level: 0, index: 0, count: 0};
      node.name = value.name;
      node._id = value._id;
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
    this.categoriesArray[0].map((data, index) => {
      data.index = index;
      data.children = []
    })
    this.categoryTree = Object.assign({}, this.categoriesArray[0]);
    this.initialize();

    this.orderArray.splice(0,1);
    for (let i = 0; i < Object.keys(this.categoryTree).length; i++) {
      console.log(this.categoryTree[i]);
      this.orderOverallArray.push({number: undefined, subcategory: this.categoryTree[i]._id, fase: 'overall', active: false})
      for (let j = 0; j < Object.keys(this.subcategories[0]).length; j++) {
        console.log(this.subcategories[0][j]['parent']);
        if (this.categoryTree[i]['_id'] === this.subcategories[0][j]['parent']['_id']) {
          this.orderArray.push({index: j, childrens: []});
          this.orderArray[j]['childrens'].push({number: undefined, subcategory: this.subcategories[0][j]._id, fase: 'eliminatoria', active: false})
          this.orderArray[j]['childrens'].push({number: undefined, subcategory: this.subcategories[0][j]._id, fase: 'semifinal', active: false})
          this.orderArray[j]['childrens'].push({number: undefined, subcategory: this.subcategories[0][j]._id, fase: 'final', active: false})
          this.orderArray[j]['childrens'].push({number: undefined, subcategory: this.subcategories[0][j]._id, fase: 'premiacion', active: false})
          this.categoryTree[i]['children'].push({_id: this.subcategories[0][j]['_id'], name: this.subcategories[0][j]['name'], level: 1, index: j, count:0});
          console.log(this.categoryTree);
        }
      }
      console.log(this.orderArray);
      this.dataInput.competitors.forEach(competitor => {
        this.categoryTree[i]['children'].forEach(subcategory => {
          if (subcategory._id === competitor.category._id) {
            subcategory.count += 1;
          }
        });
      });
      this.dataChange.next(this.data);
    }
  }

  saveChanges() {
    const fases = [];
    this.orderArray.forEach(category => {
      category.childrens.forEach(subcategory => {
        if (subcategory.active) {
          fases.push(subcategory)
        }
      });
    });
    this.orderOverallArray.forEach(category => {
      if (category.active) {
        fases.push(category)
      }
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

}

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
  level: number;
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
  private tournamentId: string;
  public editTourney: boolean = false;
  private judgesToSave: string = '';
  private competitorsToSave: string = '';
  private subcategoriesToSave: string = '';

  // Global database categories and subcategories
  public categoriesArray = [];
  public subcategoriesArray = [];

  // Local variables for the tourney
  public tourneys = [];
  public tourneyFlag: boolean = false;
  public tourneySelected: {
    _id: string,
    number?:number,
    name:string,
    type?: string,
    subcategories?:
      {name:string,
      parent:string},
    competitors?: {
      firstName: string,
      lastName: string,
      personalID: number,
      age: number,
      gender: string,
      city: string,
      subcategory: {
        name: string,
        parent:string
      },
      email?: string,
      phone?: string
    },
    judges: Array<string>;
  };
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
      const node: CategoryNode = {_id: '', name: '', children: [], level: 0};
      node.name = value.name;
      node._id = value._id
      node.level = level
      if (value != null) {
        if (typeof value === 'object') {
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
    /**
    * Form creation and class variables initialization
    */
    // this.tourneyFlag = false;
    // this.editTourney = false;
    this.tourneyRegistrationForm = new FormGroup({
      'existent': new FormControl(null),
      'name': new FormControl(null),
    });
    this.tourneyRegistrationForm.valueChanges.subscribe(
      (value) => {
        if((this.tournamentType !== null) && (value.name.length > 4) && (value.existent === null)){
          this.tourneyFlag = true;  // habilita el boton de creacion
        } else if(value.existent !== null){
          this.tourneyFlag = false;  // habilita el boton de carga
        }
      }
    );

    /**
    * Selected tournament type initialization
    */
    if (this.tournamentType !== null) {
      this.subcategories.push(this.tournamentType['subcategories']);
      console.log(this.subcategories)
    }

    /**
    * Initial request body
    */
   const body = {
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
        },
        tourneys{
          _id
          name
        }
      }`
    };

    // Initialize categories and subcategories
    this.serverService.graphql(body)
    .subscribe(res => {
      console.log(res);
      res['data']['categories'].forEach(element => {
        element.children = [];
      });
      this.categoriesArray.push(res['data']['categories']);
      this.subcategoriesArray.push(res['data']['subcategories']);
      this.tourneys.push(res['data']['tourneys']);
      console.log(this.tourneys)
      this.categoryTree = Object.assign({}, this.categoriesArray[0]);
      this.initialize(); 
      console.log(this.subcategories)
      if (this.subcategories.length > 0) {
        for (let i = 0; i < Object.keys(this.categoryTree).length; i++) {
          for (let j = 0; j < Object.keys(this.subcategories[0]).length; j++) {
            console.log(this.subcategories[0][j]['parent']);
            if (this.categoryTree[i]['_id'] === this.subcategories[0][j]['parent']['_id']) {
              this.categoryTree[i]['children'].push({_id: null, name: this.subcategories[0][j]['name'], level: 1});
              console.log(this.categoryTree);
            }
          }
        }
        this.dataChange.next(this.data);
      }
    });
    console.log(this.tourneyFlag)
    console.log(this.editTourney)
  }

  createTourney(action: string) {
    let body;
    if(action === 'create'){
      body = {
        query: `mutation {
          createTourney(input: {
            name: "${this.tourneyRegistrationForm.value.name}"
            type: "${this.tournamentType._id}"
          }) {
            _id
            name
          }
        }`
      };
    // Llamada a servicio
    this.serverService.graphql(body)
    .subscribe(res => {
      console.log(res);
      console.log(res['data']['createTourney']['_id']);
      this.tournamentId = res['data']['createTourney']['_id'];
    });
    } else if(action === 'load') {
      body = {
        query: `
        query{
            tourneyById (_id: "${this.tourneyRegistrationForm.value.existent._id}"){
              type {
              _id
              name
              subcategories{
                _id
                name
                parent{
                  _id
                  name
                }
              }
            }
          }
        }`
      }
      // Llamada a servicio
      this.serverService.graphql(body)
      .subscribe(res => {
        console.log(res);
        console.log(res['data']['tourneyById']);
        // this.tournamentId = res['data']['createTourney']['_id'];
      });
    }
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
                  this.categoryTree[i]['children'].push({_id: null, name: this.subcategories[0][lastIndex]['name'], level: 1});
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
        this.splitCompetitorByCategory(res);
        // this.competitors.push(res);
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
          this.judges.push(res['data']['createJudge']);
          console.log(this.judges)
        }
      });
  }

  selectStaringOrder() {
    const dialogRef = this.dialog.open(StartingOrderComponent, {
      width: '50%',
      data: {
        subcategories: this.subcategories,
        categories: this.categoriesArray,
        competitors: this.competitors
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
     const body = {
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
    this.serverService.graphql(body)
    .subscribe(res => {
      this.subcategoriesArray[0].push(res['data']['createSubcategory']);
    });
  }

  createCategory(form) {

    const body = {
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
    this.serverService.graphql(body)
    .subscribe(res => {
      console.log(res);
      this.categoriesArray[0].push(res['data']['createCategory']);
    });
  }

  splitCompetitorByCategory(form) {
    for (let i = 0; i < form.categories.length; i++) {
      const competitor = {
        firstName: form.firstName,
        lastName: form.lastName,
        personalID: +form.personalID,
        age: +form.age,
        gender: form.gender,
        city: form.city,
        subcategory: form.categories[i],
        email: form.email,
        phone: form.phone,
      }
      this.competitors.push(competitor);
      console.log(this.competitors);
      console.log(typeof(this.competitors[0].personalID))
    }
  }

  saveTourney(modification: string, modificationType: string) {
    let body;
    console.log(modificationType)
    console.log(Object.keys(this.judges).length);
    if((modificationType === 'competitors') && (Object.keys(this.competitors).length>0)) {
      this.competitorsToSave = "[{"
      this.competitors.map(attribute => {
        let entry = Object.entries(attribute)
        for (let i = 0; i < entry.length; i++) {
          if((entry[i][0] === 'personalID') || (entry[i][0] === 'age') || (entry[i][0] === 'number')) {
            this.competitorsToSave = this.competitorsToSave + ' ' + entry[i][0] + ': ' + entry[i][1];
          } else if (entry[i][0] === 'category') {
            let entrySubcategory = Object.entries(attribute['category']);
            this.competitorsToSave = this.competitorsToSave + ' subcategory: ' + '{';
            for (let j = 0; j < entrySubcategory.length; j++) {
              if ( entrySubcategory[j][0] === 'parent'){
                let entryParent = Object.entries(attribute['category']['parent']);
                this.competitorsToSave = this.competitorsToSave + ' ' + entrySubcategory[j][0] + ': ';
                for (let k = 0; k < entryParent.length; k++) {
                  if ( entryParent[k][0] === '_id'){
                    this.competitorsToSave = this.competitorsToSave + ' "' + entryParent[k][1] + '"';
                  }
                }
              } else if (entrySubcategory[j][0] === '_id') {
                this.competitorsToSave = this.competitorsToSave;
              } else {
              this.competitorsToSave = this.competitorsToSave + ' ' + entrySubcategory[j][0] + ': ' + ' "' + entrySubcategory[j][1] + '"';
              }
            }
            this.competitorsToSave = this.competitorsToSave + "}";
          } else {
          this.competitorsToSave = this.competitorsToSave + ' ' + entry[i][0] + ': ' + '"' + entry[i][1] + '"';
          }
        }
        if (attribute === this.competitors[this.competitors.length - 1]){
          this.competitorsToSave = this.competitorsToSave + "}]";
        } else {
          this.competitorsToSave = this.competitorsToSave + "}, {";
        }
      });

    // } else if((modification === 'subcategories') && (Object.keys(this.subcategories[0]).length>0)) {



    } else if((modificationType === 'judges') && (Object.keys(this.judges).length>0)) {

    this.judgesToSave = "[";
    this.judges.map(attribute => {
      let entry = Object.entries(attribute);
        for (let j = 0; j < entry.length; j++) {
          if ( entry[j][0] === '_id'){
            this.judgesToSave = this.judgesToSave + ' "' + entry[j][1] + '"';
          } else {
            this.judgesToSave = this.judgesToSave;
          }
        }
        if (attribute === this.judges[this.judges.length - 1]){
          this.judgesToSave = this.judgesToSave + "]";
        } else {
          this.judgesToSave = this.judgesToSave + ", ";
        }
      });
      console.log('judgesToSave')
      console.log(this.judgesToSave)
    }
    this.subcategoriesToSave = "[{"
    this.subcategories[0].map(attribute => {
      let entrySubcategory = Object.entries(attribute);
        for (let j = 0; j < entrySubcategory.length; j++) {
          if ( entrySubcategory[j][0] === 'parent'){
            let entryParent = Object.entries(attribute['parent']);
            this.subcategoriesToSave = this.subcategoriesToSave + ' ' + entrySubcategory[j][0] + ': ';
            for (let k = 0; k < entryParent.length; k++) {
              if ( entryParent[k][0] === '_id'){
                this.subcategoriesToSave = this.subcategoriesToSave + ' "' + entryParent[k][1] + '"';
              }
            }
          } else if (entrySubcategory[j][0] === '_id') {
            this.subcategoriesToSave = this.subcategoriesToSave;
          } else {
            this.subcategoriesToSave = this.subcategoriesToSave + ' ' + entrySubcategory[j][0] + ': ' + ' "' + entrySubcategory[j][1] + '"';
          }
        }
        if (attribute === this.subcategories[0][this.subcategories[0].length - 1]){
          this.subcategoriesToSave = this.subcategoriesToSave + "}]";
        } else {
          this.subcategoriesToSave = this.subcategoriesToSave + "}, {";
        }
      });
      console.log('subcategoriesToSave')
      console.log(this.subcategoriesToSave);
    if ((this.judgesToSave === '') && (this.competitorsToSave === '')) {
      console.log('Subcategorias')
      body = {
        query: `mutation {
          updateTourney(
            _id: "${this.tournamentId}"
            input: {
            name: "${this.tourneyRegistrationForm.value.name}"
            number: 5
            type: "${this.tournamentType._id}"
            subcategories: ${this.subcategoriesToSave}
            }) {
            _id
            competitors {
              firstName
              subcategory {
                name
              }
            }
            subcategories {
              name
            }
            judges {
              firstName
              _id
            }
          }
        }`
      };
    } else if (this.judgesToSave === ''){
      console.log('Competidores y subcategorias')
      body = {
        query: `mutation {
          updateTourney(
            _id: "${this.tournamentId}"
            input: {
            name: "${this.tourneyRegistrationForm.value.name}"
            number: 5
            type: "${this.tournamentType._id}"
            competitors:  ${this.competitorsToSave}
            subcategories: ${this.subcategoriesToSave}
            }) {
            _id
            competitors {
              firstName
              subcategory {
                name
              }
            }
            subcategories {
              name
            }
            judges {
              firstName
              _id
            }
          }
        }`
      };
    } else if (this.competitorsToSave === ''){
      console.log('Jueces y subcategorias')
      body = {
        query: `mutation {
          updateTourney(
            _id: "${this.tournamentId}"
            input: {
            name: "${this.tourneyRegistrationForm.value.name}"
            number: 5
            type: "${this.tournamentType._id}"
            judges: ${this.judgesToSave}
            subcategories: ${this.subcategoriesToSave}
            }) {
            _id
            competitors {
              firstName
              subcategory {
                name
              }
            }
            subcategories {
              name
            }
            judges {
              firstName
              _id
            }
          }
        }`
      };
    }  else if (this.subcategoriesToSave === ''){
      console.log('Jueces y subcategorias')
      body = {
        query: `mutation {
          updateTourney(
            _id: "${this.tournamentId}"
            input: {
            name: "${this.tourneyRegistrationForm.value.name}"
            number: 5
            type: "${this.tournamentType._id}"
            competitors:  ${this.competitorsToSave}
            judges: ${this.judgesToSave}
            }) {
            _id
            competitors {
              firstName
              subcategory {
                name
              }
            }
            subcategories {
              name
            }
            judges {
              firstName
              _id
            }
          }
        }`
      };
    } else {
      console.log('Jueces y subcategorias')
      body = {
        query: `mutation {
          updateTourney(
            _id: "${this.tournamentId}"
            input: {
            name: "${this.tourneyRegistrationForm.value.name}"
            number: 5
            type: "${this.tournamentType._id}"
            competitors:  ${this.competitorsToSave}
            judges: ${this.judgesToSave}
            subcategories: ${this.subcategoriesToSave}
            }) {
            _id
            competitors {
              firstName
              subcategory {
                name
              }
            }
            subcategories {
              name
            }
          }
        }`
      };
    }
    // body = {
    //   query: `mutation {
    //     updateTourney(
    //       _id: "${this.tournamentId}"
    //       input: {
    //       name: "${this.tourneyRegistrationForm.value.name}"
    //       number: 5
    //       type: "${this.tournamentType._id}"
    //       competitors:  ${this.competitorsToSave}
    //       judges: ${this.judgesToSave}
    //       subcategories: ${this.subcategoriesToSave}
    //       }) {
    //       _id
    //       competitors {
    //         firstName
    //         subcategory {
    //           name
    //         }
    //       }
    //     }
    //   }`
    // };
    console.log(body);

    // Llamada a servicio
    this.serverService.graphql(body)
    .subscribe(res => {
      console.log(res);
    });
  }

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

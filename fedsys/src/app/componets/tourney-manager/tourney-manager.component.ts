import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-tourney-manager',
  templateUrl: './tourney-manager.component.html',
  styleUrls: ['./tourney-manager.component.css']
})

export class TourneyManagerComponent implements OnInit {
  subcategories = [];
  startingOrder = [];
  tourney: any = {};
  tourneyID = "";
  dataOrg: any = {};

  private sub: any;

  constructor(private serverService: ServiceService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.tourneyID = params['id'];
      console.log(this.tourneyID)
   });
    const body = {
      query: `
      query{
        tourneyById (_id: "${this.tourneyID}"){
          _id
          name
          startingOrder{
            _id
            number
            subcategoryCode
            fase
            active
          } 
          subcategories{
            _id
            name
            code
            parent{
              _id
              name
            }
          }
          competitors{
            firstName
            lastName
            personalID
            age
            gender
            city
            subcategory {
              code
              name
              parent {
                _id
              }
            }
            email
            phone
          }
          judges{
            firstName
            lastName
            personalID
            email
            age
            city
          }
        }
      }`
    }

    this.serverService.graphql(body)
    .subscribe(res => {
      console.log(res)
      this.startingOrder = res['data']['tourneyById']['startingOrder']
      this.subcategories = res['data']['tourneyById']['subcategories']
      this.startingOrder.map(element => {
        this.subcategories.forEach(subcat => {
          if (element.subcategoryCode === subcat.code) {
            element.subcategory = subcat.name;
          }
        });
        element.isRealized = false;
      })
      this.tourney = res['data']['tourneyById'];
      console.log(this.startingOrder)
    })
  }

  nextFase() {
    for (let index = 0; index < this.startingOrder.length; index++) {
      const element = this.startingOrder[index];
      if (!element.isRealized && element.active) {
        console.log(element);
        const auxCompetitors = [];
        this.dataOrg = {
          tabla: element.fase,
          // competitors: ,
          jueces: this.tourney.judges,
          subcategory:element.subcategory,
          numero:element.number,
          torneo: this.tourney.name
        }
        break;
      }      
    }
    
    this.serverService.nextFase(this.dataOrg);
    this.router.navigate(['/tabla'])
  }

}

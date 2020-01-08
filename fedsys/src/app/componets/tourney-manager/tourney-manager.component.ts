import { Component, OnInit } from '@angular/core';

import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-tourney-manager',
  templateUrl: './tourney-manager.component.html',
  styleUrls: ['./tourney-manager.component.css']
})

export class TourneyManagerComponent implements OnInit {
  subcategories = []
  tournament = []
  dataOrg = {};

  constructor(private serverService: ServiceService) { }

  ngOnInit() {

    const body = {
      query: `
      query{
        tourneyById (_id: "5e1634a63282b10355c66652"){
          _id
          name
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
      this.subcategories.push(res['data']['tourneyById']['subcategories'])
      this.tournament.push(res['data']['tourneyById'])
      console.log(this.subcategories)
      console.log(this.tournament)
    })
  }

  nextFase() {
    this.serverService.nextFase(this.dataOrg);
  }

}

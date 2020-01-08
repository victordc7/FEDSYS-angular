import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-begin-tourney',
  templateUrl: './begin-tourney.component.html',
  styleUrls: ['./begin-tourney.component.css']
})
export class BeginTourneyComponent implements OnInit {

  constructor(
    private serverService: ServiceService,
    private router: Router
  ) { }

  public tourneys = [];
  public tourneySelected: any = null;

  ngOnInit() {
    const body = {
      query: ` query {
        tourneys{
          _id
          name
          competitors {
            _id
            firstName
            lastName
            athlete
            personalID
            city
            subcategory {
              _id
              code
              name
              parent {
                _id
                code
                name
              }
            }
          }
          judges {
            _id
            firstName
            lastName
            personalID
          }
          subcategories {
            _id
            code
            name
            parent {
              _id
              code
              name
            }
          }
          startingOrder {
            _id
            number
            subcategoryCode
            fase
            active
          }
          createdAt
          updatedAt
        }
      }`
    };
    this.serverService.graphql(body)
    .subscribe(res => {
      console.log(res);
      this.tourneys = res['data']['tourneys'];
      console.log(this.tourneys);
    });
  }

  beginTourney() {
    console.log(this.tourneySelected)
    this.tourneys.forEach(tourney => {
      if (this.tourneySelected === tourney._id) {
        this.tourneySelected = tourney
        this.router.navigate(['/product-details', this.tourneySelected]);
        return
      }
    });
    console.log(this.tourneySelected)
  }

}

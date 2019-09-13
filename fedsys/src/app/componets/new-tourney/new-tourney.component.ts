import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { Category } from '../../models/category.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-tourney',
  templateUrl: './new-tourney.component.html',
  styleUrls: ['./new-tourney.component.css']
})
export class NewTourneyComponent implements OnInit {
  public tournamentsArray: any;
  public started = false;

  constructor(private serverService: ServiceService,
              private router: Router,
              private route: ActivatedRoute
    ) { }

  ngOnInit() {

    this.started = false;

    // const body = {
    //   query: `{
    //     getTourney{
    //       type: ,
    //       categories: ,
    //     }
    //   }`
    // }

    // this.serverService.graphql(body)
    //   .subscribe(res => {
    //     this.tournamentsArray = res;
    // });
  }

  onNewTourney() {
    this.started = true;
    this.router.navigate(['registro'], {relativeTo: this.route});
  }

  onBack() {
    this.started = false;
    this.router.navigate(['nuevo_torneo']);
  }

  onStart() {
    // this.started = false;
    this.router.navigate(['tabla']);
  }

}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-new-tourney',
  templateUrl: './new-tourney.component.html',
  styleUrls: ['./new-tourney.component.css']
})
export class NewTourneyComponent implements OnInit {
  public tourneyRegistrationForm: FormGroup;
  public selectedTourney: {type: string, categories: Array<string>};

  public tournamentsArray = [];
  public started = false;

  constructor(private serverService: ServiceService,
              private router: Router,
              private route: ActivatedRoute
    ) { }

  ngOnInit() {

    this.started = false;
    this.selectedTourney = { type: 'A', categories: ['Fisico', 'fitness']};

    /**
    * Initial request body
    */
    const body = {
      query: `{
        getTourney{
          type: ,
          categories: ,
        }
      }`
    };
    this.serverService.graphql(body)
      .subscribe(res => {
        this.tournamentsArray.push(res);
    });

        /**
    * Form creation and class variables initialization
    */
    this.tourneyRegistrationForm = new FormGroup({
      'type': new FormControl(null, [Validators.required]),
    });
  }

  onNewTourney() {
    this.started = true;
    // this.router.navigate(['registro'], {relativeTo: this.route});
    // this.selectedTourney.type = this.tournamentsArray[this.tourneyRegistrationForm.value];
    // this.selectedTourney.categories = this.tournamentsArray[this.tourneyRegistrationForm.value];
  }

  onBack() {
    this.started = false;
    // this.router.navigate(['nuevo_torneo']);
  }

  onStart() {
    // this.started = false;
    this.router.navigate(['tabla']);
  }

}

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
  public selectedTourney: {_id: string, name: string, subcategories: Array<string>};

  public tournamentsArray = [];
  public started = false;

  constructor(
    private serverService: ServiceService,
    private router: Router,
    ) { }

  ngOnInit() {

    this.started = false;
    this.selectedTourney = { _id: '', name: '', subcategories: []};

    /**
    * Initial request body
    */
    const body = {
      query: `{
        tourneyTypes{
          _id
          name
          subcategories{
            _id
            name
            parent {
              _id
              name
            }
          }
        }
      }`
    };
    this.serverService.graphql(body)
      .subscribe(res => {
        console.log(res);
        this.tournamentsArray.push(res['data']['tourneyTypes']);
        console.log("AQUI")
        console.log(this.tournamentsArray);
    });

    /**
    * Form creation and class variables initialization
    */
    this.tourneyRegistrationForm = new FormGroup({
      'type': new FormControl(null, [Validators.required]),
    });
    this.tourneyRegistrationForm.valueChanges.subscribe(
      (value) => console.log(value)
    );
  }

  onNewTourney() {
    this.started = true;
    console.log(this.tourneyRegistrationForm.value.type._id);
    this.selectedTourney._id = this.tourneyRegistrationForm.value.type._id;
    this.selectedTourney.name = this.tourneyRegistrationForm.value.type.name;
    this.selectedTourney.subcategories = this.tourneyRegistrationForm.value.type.subcategories;
  }

  onBack() {
    this.started = false;
    // this.router.navigate(['nuevo_torneo']);
  }
  onStart() {
    // this.creatTourney();
    this.router.navigate(['tabla']);
  }

}

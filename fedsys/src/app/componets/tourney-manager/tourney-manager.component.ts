import { Component, OnInit } from '@angular/core';

import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-tourney-manager',
  templateUrl: './tourney-manager.component.html',
  styleUrls: ['./tourney-manager.component.css']
})

export class TourneyManagerComponent implements OnInit {

  dataOrg = {};

  constructor(private serverService: ServiceService) { }

  ngOnInit() {
  }

  nextFase() {
    this.serverService.nextFase(this.dataOrg);
  }

}

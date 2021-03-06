import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Competitor} from '../models/competitor.model';
import { ServiceService } from 'src/app/service.service';

@Injectable({
  providedIn: 'root'
})

export class CompetitorService {
  competitorsChanged = new Subject<Competitor[]>();

  private competitors: Competitor[] = [];

  constructor(
    private serverService: ServiceService
  ) { }

    // const body = {
    //   query:` {
    //     categories
    //   }`
    // }

  addCompetitor(competitor: Competitor) {
    this.competitors.push(competitor);
    this.competitorsChanged.next(this.competitors.slice());
  }
  //  this.serverService.graphql(body).subscribe(res => console.log(res));
}

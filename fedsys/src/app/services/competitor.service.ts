import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Competitor} from '../models/competitor.model';

@Injectable({
  providedIn: 'root'
})

export class CompetitorService {
  competitorsChanged = new Subject<Competitor[]>();

  private competitors: Competitor[] = [];

  addCompetitor(competitor: Competitor) {
    this.competitors.push(competitor);
    this.competitorsChanged.next(this.competitors.slice());
  }
}

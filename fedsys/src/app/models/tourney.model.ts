import { Competitor } from './competitor.model';
import { Judge } from './judge.model';
import { Category } from './category.model';
import { TourneyType } from './tourney-type.model';

export class Tourney {
  number: number;
  name: string;
  tourneyType: TourneyType;
  commpetitors: Competitor[];
  judges: Judge[];
  categories: Category[];
}

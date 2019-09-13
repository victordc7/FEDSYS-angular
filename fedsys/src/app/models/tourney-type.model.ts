import { Competitor } from './competitor.model';
import { Judge } from './judge.model';
import { Category } from './category.model';

export class TourneyType {
  number: number;
  name: string;
  categories: Category[];

}

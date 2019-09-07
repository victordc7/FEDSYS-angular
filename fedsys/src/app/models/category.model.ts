export class Category {
  categoryNumber: number;
  categoryName: string;
  categoryLevel: number;
  categoryParent?: number;

  constructor(number: number, name: string, level: number, parent: number) {
    this.categoryNumber = number;
    this.categoryName = name;
    this.categoryLevel = level;
    this.categoryParent = parent;
  }
}

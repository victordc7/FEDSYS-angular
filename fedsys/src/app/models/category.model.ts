export class Category {
  number: number;
  name: string;
  level: number;
  parent?: Category;

  constructor(number: number, name: string, level: number, parent: Category) {
    this.number = number;
    this.name = name;
    this.level = level;
    this.parent = parent;
  }
}

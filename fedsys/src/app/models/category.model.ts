export class Category {
  name: string;
  level?: number;
  parent?: Category;

  constructor(name: string, level: number, parent: Category) {
    this.name = name;
    this.level = level;
    this.parent = parent;
  }
}

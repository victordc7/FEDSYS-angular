export class Category {
  name: string;
  code: number;
  level?: number;
  parent?: Category;

  constructor(name: string, code :number, level: number, parent: Category) {
    this.name = name;
    this.code = code;
    this.level = level;
    this.parent = parent;
  }
}

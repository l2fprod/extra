import Filter from '@/models/filters/Filter';
import Item from '@/models/Item';

export default class TypeFilter implements Filter {

  private type: string;

  constructor(type: string) {
    this.type = type;
  }

  public accept(item: Item): boolean {
    return this.type === item.type;
  }
}

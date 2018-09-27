import Filter from './Filter';
import Item from '../Item';

export default class AndFilter implements Filter {

  private filters: Filter[];

  constructor(filters: Filter[]) {
    this.filters = filters;
  }

  public accept(item: Item): boolean {
    for (const filter of this.filters) {
      if (!filter.accept(item)) {
        return false;
      }
    }
    return true;
  }
}

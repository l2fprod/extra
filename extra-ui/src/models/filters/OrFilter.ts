import Filter from './Filter';
import Item from '../Item';

export default class OrFilter implements Filter {

  private filters: Filter[];

  constructor(filters: Filter[]) {
    this.filters = filters;
  }

  public accept(item: Item): boolean {
    if (this.filters.length === 0) {
      return true;
    }

    for (const filter of this.filters) {
      if (filter.accept(item)) {
        return true;
      }
    }
    return false;
  }
}

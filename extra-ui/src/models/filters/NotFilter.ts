import Filter from './Filter';
import Item from '../Item';

export default class NotFilter implements Filter {

  private filter: Filter;

  constructor(filter: Filter) {
    this.filter = filter;
  }

  public accept(item: Item): boolean {
    return !this.filter.accept(item);
  }
}

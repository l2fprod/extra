import Filter from '@/models/filters/Filter';
import Item from '@/models/Item';
import ResourceGroup from '@/models/ResourceGroup';

export default class ResourceGroupFilter implements Filter {

  private crn: string;

  constructor(crn: string) {
    this.crn = crn;
  }

  public accept(item: Item): boolean {
    return item.parents().find((parent: Item) => this.crn === parent.crn) !== undefined;
  }
}

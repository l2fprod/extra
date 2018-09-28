import Filter from '@/models/filters/Filter';
import Item from '@/models/Item';
import ResourceGroup from '@/models/ResourceGroup';

export default class ResourceGroupFilter implements Filter {

  private crn: string;

  constructor(crn: string) {
    this.crn = crn;
  }

  public accept(item: Item): boolean {
    if (item.parent) {
      return this.crn === item.parent!.crn;
    } else {
      return false;
    }
  }
}

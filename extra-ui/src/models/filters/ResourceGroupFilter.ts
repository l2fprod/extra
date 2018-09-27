import Filter from '@/models/filters/Filter';
import Item from '@/models/Item';
import ResourceGroup from '@/models/ResourceGroup';

export default class ResourceGroupFilter implements Filter {

  private group: ResourceGroup;

  constructor(group: ResourceGroup) {
    this.group = group;
  }

  public accept(item: Item): boolean {
    if (item.parent) {
      return this.group.crn! === item.parent!.crn;
    } else {
      return false;
    }
  }
}

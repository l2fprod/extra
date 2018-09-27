import Filter from '@/models/filters/Filter';
import Item from '@/models/Item';

export default class RegionFilter implements Filter {

  private region: string;

  constructor(region: string) {
    this.region = region;
  }

  public accept(item: Item): boolean {
    return this.region === item.region;
  }
}

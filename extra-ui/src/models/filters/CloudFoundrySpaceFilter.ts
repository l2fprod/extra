import Filter from '@/models/filters/Filter';
import Item from '@/models/Item';

/**
 * Accepts all items within a given space (services or apps)
 */
export default class CloudFoundrySpaceFilter implements Filter {

  private space: string;

  constructor(space: string) {
    this.space = space;
  }

  public accept(item: Item): boolean {
    return item.__parent != null
      && item.__parent.type === 'cf-space'
      &&  this.space === item.__parent.name;
  }
}

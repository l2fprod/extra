import Filter from '@/models/filters/Filter';
import Item from '@/models/Item';

/**
 * Accepts all items within a given organization (space or services or apps)
 */
export default class CloudFoundryOrganizationFilter implements Filter {

  private organization: string;

  constructor(organization: string) {
    this.organization = organization;
  }

  public accept(item: Item): boolean {
    if (item.parent != null && item.parent.type === 'cf-space') {
      return this.accept(item.parent);
    }

    return item.parent != null
      && item.parent.type === 'cf-organization'
      &&  this.organization === item.parent.name;
  }
}

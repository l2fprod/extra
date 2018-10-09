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
    if (item.__parent != null && item.__parent.type === 'cf-space') {
      return this.accept(item.__parent);
    }

    return item.__parent != null
      && item.__parent.type === 'cf-organization'
      &&  this.organization === item.__parent.name;
  }
}

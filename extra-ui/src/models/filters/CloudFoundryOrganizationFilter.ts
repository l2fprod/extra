import Filter from '@/models/filters/Filter';
import Item from '@/models/Item';

export default class CloudFoundryOrganizationFilter implements Filter {

  private organization: string;

  constructor(organization: string) {
    this.organization = organization;
  }

  public accept(item: Item): boolean {
    return item.parent != null
      && item.parent.type === 'cf-organization'
      &&  this.organization === item.parent.name;
  }
}

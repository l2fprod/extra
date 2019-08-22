import Item from './Item';
import ItemLookup from '@/models/ItemLookup';
import CloudFoundryOrganization from '@/models/CloudFoundryOrganization';

export default class CloudFoundrySpace extends Item {

  public organization_guid?: string;

  public resolveDependencies(lookup: ItemLookup) {
    super.resolveDependencies(lookup);

    this.__parent = lookup.getByType('cf-organization')
      .find((item: Item) => this.organization_guid! === item.resource_id);
    if (this.__parent) {
      (this.__parent as CloudFoundryOrganization).__spaces.push(this);
    }
  }
}

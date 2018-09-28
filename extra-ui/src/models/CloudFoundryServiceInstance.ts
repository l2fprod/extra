import Item from './Item';
import ItemLookup from '@/models/ItemLookup';

export default class CloudFoundryServiceInstance extends Item {

  public organization_guid?: string;

  resolveDependencies(lookup: ItemLookup) {
    this.parent = lookup.getByType('cf-organization')
    .find((item: Item) => this.organization_guid! === item.resource_id);
  }
}

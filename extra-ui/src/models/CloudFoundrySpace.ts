import Item from './Item';
import ItemLookup from '@/models/ItemLookup';

export default class CloudFoundrySpace extends Item {

  public organization_guid?: string;

  public resolveDependencies(lookup: ItemLookup) {
    // this.dashboard_url = `https://console.bluemix.net/apps/${this.resource_id}?region=${this.region}`;

    this.parent = lookup.getByType('cf-organization')
      .find((item: Item) => this.organization_guid! === item.resource_id);
  }
}

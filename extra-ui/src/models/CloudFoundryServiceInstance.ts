import Item from './Item';
import ItemLookup from '@/models/ItemLookup';

export default class CloudFoundryServiceInstance extends Item {

  public service_name?: string;
  public service_instance?: string;
  public organization_guid?: string;

  public resolveDependencies(lookup: ItemLookup) {
    this.dashboard_url =
      `https://console.bluemix.net/services/${this.service_name}/${this.service_instance}?region=${this.region}`;
    this.parent = lookup.getByType('cf-organization')
      .find((item: Item) => this.organization_guid! === item.resource_id);
  }
}

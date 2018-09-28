import Item from './Item';
import ItemLookup from '@/models/ItemLookup';
import ItemDoc from '@/models/ItemDoc';

class Doc extends ItemDoc {
  public space_guid?: string;
}

export default class CloudFoundryApplication extends Item {

  public organization_guid?: string;
  public doc?: Doc;

  public resolveDependencies(lookup: ItemLookup) {
    this.dashboard_url = `https://console.bluemix.net/apps/${this.resource_id}?region=${this.region}`;

    this.parent = lookup.getByType('cf-space')
      .find((item: Item) => this.doc!.space_guid! === item.resource_id);
  }
}

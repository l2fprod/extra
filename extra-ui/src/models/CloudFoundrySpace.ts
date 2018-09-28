import Item from './Item';
import ItemLookup from '@/models/ItemLookup';

export default class CloudFoundrySpace extends Item {

  public resolveDependencies(lookup: ItemLookup) {
    // this.dashboard_url = `https://console.bluemix.net/apps/${this.resource_id}?region=${this.region}`;
  }
}

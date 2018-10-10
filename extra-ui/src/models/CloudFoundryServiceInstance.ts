import Item from './Item';
import ItemLookup from '@/models/ItemLookup';
import ItemDoc from '@/models/ItemDoc';
import MyCatalog from '@/services/MyCatalog';

class Doc extends ItemDoc {
  public space_guid?: string;
}

export default class CloudFoundryServiceInstance extends Item {

  public service_name?: string;
  public service_instance?: string;
  public organization_guid?: string;
  public doc?: Doc;

  public resolveDependencies(lookup: ItemLookup) {
    super.resolveDependencies(lookup);
    this.__dashboardUrl =
      `https://console.bluemix.net/services/${this.service_name}/${this.service_instance}?region=${this.region}`;
    this.__parent = lookup.getByType('cf-space')
      .find((item: Item) => this.doc!.space_guid! === item.resource_id);
  }

  public resolved() {
    super.resolved();

    const entry = MyCatalog.getEntry(this.service_name);
    if (entry) {
      this.__extendedType = entry.displayName;
      this.__icon = entry.imageUrl;
    }
  }

  public toText(): string {
    return super.toText() + (this.service_name || '');
  }

}

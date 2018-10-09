import Item from './Item';
import ItemLookup from '@/models/ItemLookup';
import ItemDoc from '@/models/ItemDoc';

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
    this.__extendedType = this.service_name;
  }

  public toText(): string {
    return super.toText() + (this.service_name || '');
  }

}

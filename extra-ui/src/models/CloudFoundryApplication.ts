import Item from './Item';
import ItemLookup from '@/models/ItemLookup';
import ItemDoc from '@/models/ItemDoc';

class Doc extends ItemDoc {
  public space_guid?: string;
  public detected_buildpack?: string;
  public routes?: any[];
  public state?: string;
}

export default class CloudFoundryApplication extends Item {

  public organization_guid?: string;
  public doc?: Doc;

  public resolveDependencies(lookup: ItemLookup) {
    super.resolveDependencies(lookup);
    this.__dashboardUrl = `https://cloud.ibm.com/apps/${this.resource_id}?region=${this.region}`;
    this.__parent = lookup.getByType('cf-space')
      .find((item: Item) => this.doc!.space_guid! === item.resource_id);
  }

  public resolved() {
    super.resolved();
    this.__extendedType = this.doc!.detected_buildpack;
    this.__status = this.doc!.state;
  }

}

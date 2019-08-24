import ResourceInstance from '@/models/ResourceInstance';
import ItemLookup from '@/models/ItemLookup';
import Item from '../Item';
import ItemDoc from '../ItemDoc';
import VPC from './VPC';
import Instance from './Instance';

class Vpc {
  public id?: string;
}
class Doc extends ItemDoc {
  public vpc?: Vpc;
}

export default class Subnet extends ResourceInstance {

  public __instances: Instance[] = [];
  public doc?: Doc;

  public resolveDependencies(lookup: ItemLookup) {
    super.resolveDependencies(lookup);

    this.__dashboardUrl =
      `https://cloud.ibm.com/vpc/network/subnet/${this.region}~${this.resource_id}/overview`;

    this.__parent = lookup.getByType('vpc')
      .find((item: Item) => this.doc!.vpc!.id! === item.resource_id);
    if (this.__parent) {
      (this.__parent as VPC).__subnets.push(this);
    }
  }

}

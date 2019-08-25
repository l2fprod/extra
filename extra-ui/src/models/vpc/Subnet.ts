import ResourceInstance from '@/models/ResourceInstance';
import ItemLookup from '@/models/ItemLookup';
import Item from '../Item';
import ItemDoc, { DocObjectWithId } from '../ItemDoc';
import VPC from './VPC';
import Instance from './Instance';

class Doc extends ItemDoc {
  public vpc?: DocObjectWithId;
}

export default class Subnet extends ResourceInstance {

  public __vpc?: VPC;
  public __instances: Instance[] = [];
  public doc?: Doc;

  public resolveDependencies(lookup: ItemLookup) {
    super.resolveDependencies(lookup);

    this.__dashboardUrl =
      `https://cloud.ibm.com/vpc/network/subnet/${this.region}~${this.resource_id}/overview`;

    this.__vpc = lookup.getByType('vpc')
      .find((item: Item) => this.doc!.vpc!.id! === item.resource_id) as VPC;
    if (this.__vpc) {
      this.__vpc.__subnets.push(this);
    }
  }

}

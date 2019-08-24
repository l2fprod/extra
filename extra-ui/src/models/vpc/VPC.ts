import ResourceInstance from '@/models/ResourceInstance';
import ItemLookup from '@/models/ItemLookup';
import Subnet from './Subnet';

export default class VPC extends ResourceInstance {

  public __subnets: Subnet[] = [];

  public resolveDependencies(lookup: ItemLookup) {
    super.resolveDependencies(lookup);

    this.__dashboardUrl =
      `https://cloud.ibm.com/vpc/network/vpc/${this.region}~${this.resource_id}/overview`;
  }

}

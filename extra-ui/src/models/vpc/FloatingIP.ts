import ResourceInstance from '@/models/ResourceInstance';
import ItemLookup from '@/models/ItemLookup';
import ItemDoc from '../ItemDoc';

class Target {
  public id?: string;
}

class Doc extends ItemDoc {
  public target?: Target;
}

export default class FloatingIP extends ResourceInstance {

  public doc?: Doc;

  public resolveDependencies(lookup: ItemLookup) {
    super.resolveDependencies(lookup);

    this.__dashboardUrl =
      `https://cloud.ibm.com/vpc/network/floatingIPs`;
  }

}

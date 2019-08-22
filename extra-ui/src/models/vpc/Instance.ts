import ResourceInstance from '@/models/ResourceInstance';
import ItemLookup from '@/models/ItemLookup';

export default class Instance extends ResourceInstance {

  public resolveDependencies(lookup: ItemLookup) {
    super.resolveDependencies(lookup);

    this.__dashboardUrl =
      `https://cloud.ibm.com/vpc/compute/vs/${this.region}~${this.resource_id}/overview`;
  }

}

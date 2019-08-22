import ResourceInstance from '@/models/ResourceInstance';
import ItemLookup from '@/models/ItemLookup';

export default class Toolchain extends ResourceInstance {

  public resolveDependencies(lookup: ItemLookup) {
    super.resolveDependencies(lookup);

    this.__dashboardUrl =
    `https://cloud.ibm.com/devops/toolchains/${this.service_instance}?env_id=ibm:yp:${this.region}`;
  }

}

import ResourceInstance from '@/models/ResourceInstance';
import ItemLookup from '@/models/ItemLookup';

export default class Toolchain extends ResourceInstance {

  public resolveDependencies(lookup: ItemLookup) {
    super.resolveDependencies(lookup);

    this.__dashboardUrl =
    `https://console.bluemix.net/devops/toolchains/${this.service_instance}?env_id=ibm:yp:${this.region}`;
  }

}

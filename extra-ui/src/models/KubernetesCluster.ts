import Item from './Item';
import ItemLookup from '@/models/ItemLookup';
import ItemDoc from '@/models/ItemDoc';
import ResourceInstance from '@/models/ResourceInstance';

class Doc extends ItemDoc {
  public resource_group_id?: string;
}

export default class KubernetesCluster extends ResourceInstance {

  public doc?: Doc;

  public resolveDependencies(lookup: ItemLookup) {
    super.resolveDependencies(lookup);
    this.__dashboardUrl = 'https://console.bluemix.net/containers-kubernetes/clusters/' +
      `${this.service_instance}/overview?region=${this.region}`;

    if (this.doc && this.doc.resource_group_id) {
      this.__resourceGroup = lookup.findByResourceId(this.doc!.resource_group_id!);
      this.__parent = this.__resourceGroup;
    }
  }

}

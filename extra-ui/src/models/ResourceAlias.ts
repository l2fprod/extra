import Item from '@/models/Item';
import ItemLookup from '@/models/ItemLookup';
import ResourceGroup from '@/models/ResourceGroup';

export default class ResourceAlias extends Item {

  public service_name?: string;
  public service_instance?: string;
  public resourceGroup?: ResourceGroup;

  public resolveDependencies(lookup: ItemLookup) {
    super.resolveDependencies(lookup);
    this.__dashboardUrl =
      `https://console.bluemix.net/services/${this.service_name}/${this.service_instance}?region=${this.region}`;
  }
}

import Item from '@/models/Item';
import ResourceGroup from '@/models/ResourceGroup';
import ItemLookup from '@/models/ItemLookup';

export default class ResourceInstance extends Item {

  public service_name?: string;
  public service_instance?: string;

  public resourceGroup?: ResourceGroup;

  public url(): string {
    return `https://console.bluemix.net/services/${this.service_name}/${this.service_instance}?region=${this.region}`;
  }

  public resolveDependencies(lookup: ItemLookup) {
    if (this.doc && this.doc.resource_group_crn) {
      this.resourceGroup = lookup.findByCrn(this.doc.resource_group_crn);
      this.parent = this.resourceGroup;
    }
  }
}

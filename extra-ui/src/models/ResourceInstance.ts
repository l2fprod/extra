import Item from '@/models/Item';
import ResourceGroup from '@/models/ResourceGroup';
import ItemLookup from '@/models/ItemLookup';
import MyCatalog from '@/services/MyCatalog';

export default class ResourceInstance extends Item {

  public service_name?: string;
  public service_instance?: string;

  public __resourceGroup?: ResourceGroup;

  public resolveDependencies(lookup: ItemLookup) {
    super.resolveDependencies(lookup);

    this.__dashboardUrl =
      `https://console.bluemix.net/services/${this.service_name}/${this.service_instance}?region=${this.region}`;

    if (this.doc && this.doc.resource_group_crn) {
      this.__resourceGroup = lookup.findByCrn(this.doc.resource_group_crn);
      this.__parent = this.__resourceGroup;
    }
  }

  public resolved() {
    super.resolved();

    const entry = MyCatalog.getEntry(this.service_name);
    if (entry) {
      this.__extendedType = entry.displayName;
      this.__icon = entry.imageUrl;
    }
  }

  public toText(): string {
    return super.toText() + ' ' + (this.service_name || '');
  }
}

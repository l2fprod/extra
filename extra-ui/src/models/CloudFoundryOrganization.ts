import Item from './Item';
import ItemLookup from '@/models/ItemLookup';
import CloudFoundrySpace from '@/models/CloudFoundrySpace';

export default class CloudFoundryOrganization extends Item {

  public __spaces: CloudFoundrySpace[] = [];

  public resolveDependencies(lookup: ItemLookup) {
    super.resolveDependencies(lookup);
  }
}

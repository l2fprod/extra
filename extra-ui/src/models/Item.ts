import ItemDoc from '@/models/ItemDoc';
import ItemLookup from '@/models/ItemLookup';

export default class Item {

  public crn?: string;
  public resource_id?: string;
  public region?: string;
  public name?: string;
  public family?: string;
  public type?: string;
  public creation_date?: string;
  public doc?: ItemDoc;

  public parent?: Item;
  public dashboard_url?: string;

  public resolveDependencies(lookup: ItemLookup) {
    //
  }

  public toText():string {
    return (this.name || '');
  }

}

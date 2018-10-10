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

  public __parent?: Item;
  public __dashboardUrl?: string;
  public __extendedType?: string;
  public __pathToRoot: string = '';
  public __status?: string;
  public __icon?: string;

  public resolveDependencies(lookup: ItemLookup) {
    //
  }

  //
  public resolved() {
    this.__extendedType = this.type;
    this.__pathToRoot = this.parents().map((item): string => item.name!).join(' / ');
  }

  public toText(): string {
    return (this.name || '')
      + ' ' + (this.__extendedType || '');
  }

  public parents(): Item[] {
    const result: Item[] = [];
    let current: Item | undefined = this;
    while (current != null && current!.__parent != null) {
      result.push(current!.__parent!);
      current = current!.__parent;
    }
    return result.reverse();
  }
}

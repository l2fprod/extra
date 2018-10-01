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
  public pathToRoot: string = '';

  public resolveDependencies(lookup: ItemLookup) {
    //
  }

  //
  public resolved() {
    this.pathToRoot = this.parents().map((item): string => item.name!).join(' / ');
  }

  public toText(): string {
    return (this.name || '');
  }

  public parents(): Item[] {
    const result: Item[] = [];
    let current: Item | undefined = this;
    while (current != null && current!.parent != null) {
      result.push(current!.parent!);
      current = current!.parent;
    }
    return result.reverse();
  }
}

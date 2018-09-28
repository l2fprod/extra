import Filter from '@/models/filters/Filter';
import Item from '@/models/Item';

export class TextFilter implements Filter {

  private text: string;

  constructor(text: string) {
    this.text = text.toLowerCase();
  }

  public accept(item: Item): boolean {
    if (this.text.length === 0) {
      return true;
    }

    return item.name != null && item.name!.toLowerCase().indexOf(this.text) >= 0;
  }
}

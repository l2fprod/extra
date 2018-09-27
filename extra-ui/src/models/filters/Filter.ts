import Item from '@/models/Item';

export default interface Filter {
  accept(item: Item): boolean;
}

import Item from '@/models/Item';

export default interface ItemLookup {
  findByCrn(crn: string): Item | undefined;
  findByResourceId(id: string): Item | undefined;
  getByType(type: string): Item[];
}

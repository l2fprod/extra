import Item from './Item';
import CloudFoundryApplication from '@/models/CloudFoundryApplication';
import ResourceGroup from '@/models/ResourceGroup';
import ResourceInstance from '@/models/ResourceInstance';
import ResourceBinding from '@/models/ResourceBinding';
import ResourceAlias from '@/models/ResourceAlias';
import CloudFoundryServiceBinding from '@/models/CloudFoundryServiceBinding';
import CloudFoundryOrganization from '@/models/CloudFoundryOrganization';
import CloudFoundryServiceInstance from '@/models/CloudFoundryServiceInstance';

export class ItemType {
  public id: string;
  public name: string;
  public icon: string;
  public factory: () => Item;
  constructor(id: string, name: string, icon: string, factory: () => Item) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.factory = factory;
  }
}

export const TYPES: ItemType[] = [
  new ItemType('cf-application', 'Cloud Foundry App', '', () => new CloudFoundryApplication()),
  new ItemType('cf-organization', 'Cloud Foundry Organization', '', () => new CloudFoundryOrganization()),
  new ItemType('cf-service-binding', 'Cloud Foundry Service Binding', '', () => new CloudFoundryServiceBinding()),
  new ItemType('cf-service-instance', 'Cloud Foundry Service Instance', '', () => new CloudFoundryServiceInstance()),
  new ItemType('resource-group', 'Resource Group', '', () => new ResourceGroup()),
  new ItemType('resource-instance', 'Resource Instance', '', () => new ResourceInstance()),
  new ItemType('resource-alias', 'Resource Alias', '', () => new ResourceAlias()),
  new ItemType('resource-binding', 'Resource Binding', '', () => new ResourceBinding()),
];

const TYPESbyId: any = {};
TYPES.forEach((type) => TYPESbyId[type.id] = type);

export function createItem(item: any): Item {
  let subclass;
  const type: ItemType = TYPESbyId[item.type];
  if (type != null) {
    subclass = type.factory();
  } else {
    console.log(`Type ${item.type} is not supported`);
    subclass = new Item();
  }

  return Object.assign(subclass, item);
}

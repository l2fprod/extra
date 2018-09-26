import Item from './Item';
import CloudFoundryApplication from '@/models/CloudFoundryApplication';
import ResourceInstance from '@/models/ResourceInstance';

export function createItem(item: any): Item {
  let subclass;
  switch (item.type) {
    case 'cf-application':
      subclass = new CloudFoundryApplication();
      break;
    case 'resource-instance':
      subclass = new ResourceInstance();
      break;
    case 'cf-organization':
    case 'cf-service-binding':
    case 'cf-service-instance':
    case 'cf-space':
    case 'k8-cluster':
    case 'resource-alias':
    case 'resource-binding':
    case 'resource-group':
    default:
      subclass = new Item();
  }

  return Object.assign(subclass, item);
}

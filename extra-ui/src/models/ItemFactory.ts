import Item from './Item';
import CloudFoundryApplication from '@/models/CloudFoundryApplication';
import ResourceGroup from '@/models/ResourceGroup';
import ResourceInstance from '@/models/ResourceInstance';

export const TYPES = [
  {
    id: 'cf-application',
    name: 'Cloud Foundry App',
  },
  // {
  //   name: 'Cloud Foundry Organization',
  //   id: 'cf-application',
  // },
  {
    name: 'Resource Group',
    id: 'resource-group',
  },
  {
    name: 'Resource Instance',
    id: 'resource-instance',
  },
];

// export enum ItemType {
//   RESOURCE_GROUP = 'resource-group',
// }

// export enum ItemType {
//   CF_APPLICATION,
//   CF_ORGANIZATION,
//   // 'cf-application',
//   // 'resource-instance',
//   // 'cf-organization',
//   // 'cf-service-binding',
//   // 'cf-service-instance',
//   // 'cf-space',
//   // 'k8-cluster',
//   // 'resource-alias',
//   // 'resource-binding',
//   // 'resource-group',
// }

export function createItem(item: any): Item {
  let subclass;
  switch (item.type) {
    case 'cf-application':
      subclass = new CloudFoundryApplication();
      break;
    case 'resource-instance':
      subclass = new ResourceInstance();
      break;
    case 'resource-group':
      subclass = new ResourceGroup();
      break;
    case 'cf-organization':
    case 'cf-service-binding':
    case 'cf-service-instance':
    case 'cf-space':
    case 'k8-cluster':
    case 'resource-alias':
    case 'resource-binding':
    default:
      subclass = new Item();
  }

  return Object.assign(subclass, item);
}

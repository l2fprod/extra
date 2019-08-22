import Item from './Item';
import CloudFoundryApplication from '@/models/CloudFoundryApplication';
import ResourceGroup from '@/models/ResourceGroup';
import ResourceInstance from '@/models/ResourceInstance';
import ResourceBinding from '@/models/ResourceBinding';
import ResourceAlias from '@/models/ResourceAlias';
import CloudFoundryServiceBinding from '@/models/CloudFoundryServiceBinding';
import CloudFoundryOrganization from '@/models/CloudFoundryOrganization';
import CloudFoundryServiceInstance from '@/models/CloudFoundryServiceInstance';
import KubernetesCluster from '@/models/KubernetesCluster';
import CloudFoundrySpace from '@/models/CloudFoundrySpace';
import Toolchain from '@/models/Toolchain';

import VPC from './vpc/VPC';
import Instance from './vpc/Instance';
import FloatingIP from './vpc/FloatingIP';
import Image from './vpc/Image';
import Volume from './vpc/Volume';
import PublicGateway from './vpc/PublicGateway';
import Subnet from './vpc/Subnet';
import Key from './vpc/Key';
import SecurityGroup from './vpc/SecurityGroup';
import FileStorage from './FileStorage';

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
  new ItemType('resource-group', 'Resource Group', '', () => new ResourceGroup()),
  new ItemType('resource-instance', 'Resource Instance', '', () => new ResourceInstance()),
  new ItemType('resource-alias', 'Resource Alias', '', () => new ResourceAlias()),
  new ItemType('resource-binding', 'Resource Binding', '', () => new ResourceBinding()),
  new ItemType('k8-cluster', 'Kubernetes Cluster', '', () => new KubernetesCluster()),
  new ItemType('cf-application', 'Cloud Foundry App', '', () => new CloudFoundryApplication()),
  new ItemType('cf-organization', 'Cloud Foundry Organization', '', () => new CloudFoundryOrganization()),
  new ItemType('cf-space', 'Cloud Foundry Space', '', () => new CloudFoundrySpace()),
  new ItemType('cf-service-binding', 'Cloud Foundry Service Binding', '', () => new CloudFoundryServiceBinding()),
  new ItemType('cf-service-instance', 'Cloud Foundry Service Instance', '', () => new CloudFoundryServiceInstance()),
  new ItemType('toolchain', 'Toolchain', '', () => new Toolchain()),

  new ItemType('vpc', 'Virtual Private Cloud', '', () => new VPC()),
  new ItemType('instance', 'Virtual Server Instance for VPC', '', () => new Instance()),
  new ItemType('floating-ip', 'Floating IP for VPC', '', () => new FloatingIP()),
  new ItemType('image', 'Image for VPC', '', () => new Image()),
  new ItemType('volume', 'Block Storage Volume for VPC', '', () => new Volume()),
  new ItemType('public-gateway', 'Public Gateway for VPC', '', () => new PublicGateway()),
  new ItemType('subnet', 'Subnet for VPC', '', () => new Subnet()),
  new ItemType('key', 'SSH Key for VPC', '', () => new Key()),
  new ItemType('security-group', 'Security Group for VPC', '', () => new SecurityGroup()),

  new ItemType('file-storage', 'File Storage', '', () => new FileStorage()),
];

const TYPESbyId: any = {};
TYPES.forEach((type) => TYPESbyId[type.id] = type);

export function createItem(item: any): Item {
  let subclass;
  let type: ItemType | null = null;

  if (item.doc && item.doc.sub_type) {
    type = TYPESbyId[item.doc.sub_type];
  }

  if (!type) {
    type = TYPESbyId[item.type];
  }

  if (type != null) {
    subclass = type.factory();
    subclass.__type = type;
  } else {
    console.log(`Type ${item.type} is not supported`);
    subclass = new Item();
  }

  return Object.assign(subclass, item);
}

import ResourceInstance from '@/models/ResourceInstance';
import ItemLookup from '@/models/ItemLookup';
import ItemDoc from '../ItemDoc';
import Item from '../Item';
import Subnet from './Subnet';
import VPC from './VPC';
import FloatingIP from './FloatingIP';

class _Subnet {
  public id?: string;
}

class Vpc {
  public id?: string;
}

class NetworkInterface {
  public subnet?: _Subnet;
  public primary_ipv4_address?: string;
  public id?: string;
}

class Doc extends ItemDoc {
  public primary_network_interface?: NetworkInterface;
  public vpc?: Vpc;
}

export default class Instance extends ResourceInstance {

  public doc?: Doc;

  public __vpc?: VPC;
  public __floatingIP?: FloatingIP;

  public resolveDependencies(lookup: ItemLookup) {
    super.resolveDependencies(lookup);

    this.__dashboardUrl =
      `https://cloud.ibm.com/vpc/compute/vs/${this.region}~${this.resource_id}/overview`;

    this.__parent = lookup.getByType('subnet')
      .find((item: Item) => this.doc!.primary_network_interface!.subnet!.id === item.resource_id);
    if (this.__parent) {
      (this.__parent as Subnet).__instances.push(this);
    }

    this.__floatingIP = lookup.getByType('floating-ip')
      .find((item: Item) => {
        const fip: FloatingIP = item as FloatingIP;
        return (fip.doc!.target !== null) && (fip.doc!.target!.id! === this.doc!.primary_network_interface!.id!);
      }) as FloatingIP;

    this.__vpc = lookup.findByResourceId(this.doc!.vpc!.id!) as VPC;
  }

}

import Item from '@/models/Item';

export default class ResourceInstance extends Item {

  public service_name?: string;
  public service_instance?: string;

  url(): string {
    return `https://console.bluemix.net/services/${this.service_name}/${this.service_instance}?region=${this.region}`;
  }
}
import Item from './Item';

export default class CloudFoundryApplication extends Item {

  url(): string {
    return `https://console.bluemix.net/apps/${this.resource_id}?region=${this.region}`;
  }
}
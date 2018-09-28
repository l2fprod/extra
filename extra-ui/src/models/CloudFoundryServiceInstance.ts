import Item from './Item';
import ItemLookup from '@/models/ItemLookup';

export default class CloudFoundryServiceInstance extends Item {

  public service_name?: string;
  public service_instance?: string;
  public organization_guid?: string;

  resolveDependencies(lookup: ItemLookup) {
    this.dashboard_url = `https://console.bluemix.net/services/${this.service_name}/${this.service_instance}?region=${this.region}`;
    // this.dashboard_url =
    // https://console.bluemix.net/services/mobile-foundation/62dd3ee5-48c2-4526-84a0-f7740da6dc99?ace_config=%7B%22region%22%3A%22us-south%22%2C%22orgGuid%22%3A%2237d3ba38-7697-495a-b3c6-157154d0be62%22%2C%22spaceGuid%22%3A%22d79807ab-0f94-4999-9c90-68bc5b74f07e%22%2C%22redirect%22%3A%22https%3A%2F%2Fconsole.bluemix.net%2Fdashboard%2Fapps%2F%22%2C%22bluemixUIVersion%22%3A%22v6%22%2C%22crn%22%3A%22crn%3Av1%3Abluemix%3Apublic%3Amobile-foundation%3Aus-south%3As%2Fd79807ab-0f94-4999-9c90-68bc5b74f07e%3A62dd3ee5-48c2-4526-84a0-f7740da6dc99%3Acf-service-instance%3A%22%2C%22id%22%3A%2262dd3ee5-48c2-4526-84a0-f7740da6dc99%22%7D&env_id=ibm%3Ayp%3Aus-south
    this.parent = lookup.getByType('cf-organization')
      .find((item: Item) => this.organization_guid! === item.resource_id);
  }
}

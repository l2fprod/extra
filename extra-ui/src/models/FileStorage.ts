import ResourceInstance from '@/models/ResourceInstance';
import ItemLookup from '@/models/ItemLookup';

export default class FileStorage extends ResourceInstance {

  public resolveDependencies(lookup: ItemLookup) {
    super.resolveDependencies(lookup);

    this.__dashboardUrl =
      `https://cloud.ibm.com/classic/storage/file/${this.service_instance}`;
  }

}

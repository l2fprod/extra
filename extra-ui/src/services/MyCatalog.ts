import axios from 'axios';

interface Entry {
  name: string;
  imageUrl: string;
  displayName: string;
}

const MyCatalog = {
  catalog: [],
  resourceNameToResource: new Map<string, Entry>(),
  async initialize() {
    const self = this;
    let response;
    try {
      response = await axios.get('https://mycatalog-dev.mybluemix.net/generated/resources.json');
    } catch (err) {
      console.log(err);
    }

    // use our embedded version - might not be the latest
    if (!response) {
      try {
        response = await axios.get('/resources.json');
        console.log('Using embedded resource catalog');
      } catch (err) {
        console.log(err);
        return;
      }
    }

    self.catalog = response.data;
    self.catalog.forEach((entry: Entry) => {
      self.resourceNameToResource.set(entry.name, entry);
    });
  },
  getIcon(service?: string): string | undefined {
    const entry = this.getEntry(service);
    return entry ? entry.imageUrl : undefined;
  },
  getEntry(service?: string): Entry | undefined {
    if (!service) {
      return undefined;
    }
    const entry: Entry | undefined = this.resourceNameToResource.get(service!);
    if (!entry) {
      return undefined;
    }

    return entry;
  },
};



export default MyCatalog;

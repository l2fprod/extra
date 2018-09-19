import Api from '@/api/Api';

export default class Store {

  public user = null;

  private api = new Api('http://0.0.0.0:32826');

  public async login() {
    this.user = (await this.api.login()).data;
  }
}

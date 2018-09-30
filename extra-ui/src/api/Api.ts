import axios from 'axios';

export default class Api {

  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  public login() {
    return axios.get(`${this.endpoint}/api/user`);
  }

  public refresh() {
    return axios.get(`${this.endpoint}/api/resources/refresh`);
  }

  public get() {
    return axios.get(`${this.endpoint}/db/all.json`);
  }
}

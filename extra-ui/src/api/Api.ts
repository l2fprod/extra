import axios from 'axios';

export default class Api {

  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  public login() {
    return axios.get(`${this.endpoint}/api/user`);
  }
}

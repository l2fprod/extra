export default class Item {

  public crn?: string;
  public resource_id?: string;
  public region?: string;
  public name?: string;
  public family?: string;
  public type?: string;
  public creation_date?: string;

  url(): string | null {
    return null;
  }

}
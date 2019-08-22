class ResourceGroup {
  public id?: string;
}

export default class ItemDoc {
  public resource_group_crn?: string;
  public sub_type?: string;
  public resource_group?: ResourceGroup;
}

<template>
  <div class="filters" :style="cssProps">
    <v-expansion-panel expand>
      <v-expansion-panel-content>
        <div slot="header">
          <span class="filter-title" v-bind:class="{'has-filter-selected': selectedGroups.length > 0}">Resource Group</span>
        </div>
        <v-list dense>
          <v-list-tile v-for="group in $store.getters.resourcesByType('resource-group')" v-bind:key="group.crn">
            <v-list-tile-action>
              <v-checkbox v-model="selectedGroups" :value="group.crn" @change="updateFilter">
                <span class="filter-item" slot="label">{{group.name}}
                  <span class="filter-count font-weight-thin"> ({{ countInGroup(group) }})</span>
                </span>
              </v-checkbox>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-expansion-panel-content>
      <v-expansion-panel-content>
        <div slot="header">
          <span class="filter-title" v-bind:class="{'has-filter-selected': selectedOrgs.length > 0}">Cloud Foundry</span>
        </div>
        <v-list dense>
          <template v-for="organization in $store.getters.organizations">
            <v-list-tile  v-bind:key="organization">
              <v-list-tile-action>
                <v-checkbox v-model="selectedOrgs" :value="organization" @change="updateFilter">
                  <span class="filter-item" slot="label">{{organization}}
                    <span class="filter-count font-weight-thin"> ({{ countInOrganization(organization) }})</span>
                  </span>
                </v-checkbox>
              </v-list-tile-action>
            </v-list-tile>
            <v-list-tile class="nested-item" v-for="space in $store.getters.spaces(organization)" v-bind:key="organization + '/' + space">
              <v-list-tile-action>
                <v-checkbox v-model="selectedSpaces[organization + '\t' + space]" @change="updateFilter">
                  <span class="filter-item" slot="label">{{space}}
                    <span class="filter-count font-weight-thin"> ({{ countInSpace(organization, space) }})</span>
                  </span>
                </v-checkbox>
              </v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list>
      </v-expansion-panel-content>
      <v-expansion-panel-content>
        <div slot="header">
          <span class="filter-title" v-bind:class="{'has-filter-selected': selectedRegions.length > 0}">Location</span>
        </div>
        <v-list dense>
          <v-list-tile v-for="region in $store.getters.regions" v-bind:key="region">
            <v-list-tile-action>
              <v-checkbox v-model="selectedRegions" :value="region" @change="updateFilter">
                <span class="filter-item" slot="label">{{region}}
                  <span class="filter-count font-weight-thin"> ({{ countInRegion(region) }})</span>
                </span>
              </v-checkbox>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-expansion-panel-content>
      <v-expansion-panel-content>
        <div slot="header">
          <span class="filter-title" v-bind:class="{'has-filter-selected': selectedTypes.length > 0}">Type</span>
        </div>
        <v-list dense>
          <v-list-tile v-for="type in types" v-bind:key="type.id">
            <v-list-tile-action>
              <v-checkbox v-model="selectedTypes" :value="type.id" @change="updateFilter">
                <span class="filter-item" slot="label">{{type.name}}
                  <span class="filter-count font-weight-thin"> ({{ countInType(type) }})</span>
                </span>
              </v-checkbox>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { TYPES, ItemType } from '@/models/ItemFactory';
import ResourceGroup from '@/models/ResourceGroup';
import ResourceGroupFilter from '@/models/filters/ResourceGroupFilter';
import TypeFilter from '@/models/filters/TypeFilter';
import RegionFilter from '@/models/filters/RegionFilter';
import CloudFoundryOrganizationFilter from '@/models/filters/CloudFoundryOrganizationFilter';
import CloudFoundrySpaceFilter from '@/models/filters/CloudFoundrySpaceFilter';
import AndFilter from '@/models/filters/AndFilter';
import OrFilter from '@/models/filters/OrFilter';
import NotFilter from '@/models/filters/NotFilter';
import Item from '@/models/Item';
import Filter from '@/models/filters/Filter';

interface SpaceNameToBoolean {
  [key: string]: boolean;
}

@Component
export default class Faceted extends Vue {

  get cssProps() {
    return {
      '--secondary-color': this.$vuetify.theme.secondary,
    };
  }

  public selectedGroups: string[] = [];
  public selectedTypes: string[] = [];
  public selectedRegions: string[] = [];
  public selectedOrgs: string[] = [];
  public selectedSpaces: SpaceNameToBoolean = {};
  private types = TYPES;

  public countInGroup(group: ResourceGroup) {
    return this.$store.getters.filteredResources(new ResourceGroupFilter(group.crn!)).length;
  }

  public countInOrganization(organization: string) {
    return this.$store.getters.filteredResources(new CloudFoundryOrganizationFilter(organization)).length;
  }

  public countInRegion(region: string) {
    return this.$store.getters.filteredResources(new RegionFilter(region)).length;
  }

  public countInType(type: ItemType) {
    return this.$store.getters.filteredResources(new TypeFilter(type.id)).length;
  }

  public countInSpace(organization: string, space: string) {
    return this.$store.getters.filteredResources(
      new AndFilter([
        new CloudFoundryOrganizationFilter(organization),
        new CloudFoundrySpaceFilter(space),
    ])).length;
  }

  public resetFilter() {
    this.selectedGroups = [];
    this.selectedTypes = [];
    this.selectedRegions = [];
    this.selectedOrgs = [];
    this.updateFilter();
  }

  public updateFilter() {
    const groupFilters = this.selectedGroups.map((group) => new ResourceGroupFilter(group));
    const typesFilters = this.selectedTypes.map((type) => new TypeFilter(type));
    const regionsFilters = this.selectedRegions.map((region) => new RegionFilter(region));
    const organizationsFilters =
      this.selectedOrgs.map((organization) => new CloudFoundryOrganizationFilter(organization));
    const spaceFilters: Filter[] = [];
    Object.keys(this.selectedSpaces).forEach((orgAndSpace: string) => {
      if (this.selectedSpaces[orgAndSpace]) {
        const values = orgAndSpace.split('\t');
        spaceFilters.push(new AndFilter([
          new CloudFoundryOrganizationFilter(values[0]),
          new CloudFoundrySpaceFilter(values[1]),
        ]));
      }
    });
    const filter = new AndFilter([
      new OrFilter(groupFilters),
      new OrFilter(typesFilters),
      new OrFilter(regionsFilters),
      new OrFilter(organizationsFilters),
      new OrFilter(spaceFilters),
    ]);
    this.$store.dispatch('filter', filter);
  }

  protected mounted() {
    this.updateFilter();
  }

}
</script>

<style lang="scss" scoped>
.filters {
  width: 300px;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.has-filter-selected {
  font-weight: bold;
}

.filter-item {
  overflow: hidden;
  font-size: 13px;
  color: var(--secondary-color);
  text-align: left;
}

.nested-item {
  margin-left: 20px;
}
</style>

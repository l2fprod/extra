<template>
  <div class="filters" :style="cssProps">
    <v-expansion-panel expand>
      <v-expansion-panel-content>
        <div slot="header"><span class="filter-title">Resource Group</span></div>
        <v-list dense>
          <v-list-tile v-for="group in $store.state.resourcesByType.get('resource-group')" v-bind:key="group.id">
            <v-list-tile-action>
              <v-checkbox v-model="selectedGroups" :value="group" @change="updateFilter">
                <span class="filter-item" slot="label">{{group.name}}</span>
              </v-checkbox>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-expansion-panel-content>
      <v-expansion-panel-content>
        <div slot="header"><span class="filter-title">Cloud Foundry</span></div>
        <v-list dense>
          <v-list-tile v-for="organization in organizations" v-bind:key="organization">
            <v-list-tile-action>
              <v-checkbox v-model="selectedOrgs" :value="organization" @change="updateFilter">
                <span class="filter-item" slot="label">{{organization}}</span>
              </v-checkbox>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-expansion-panel-content>
      <v-expansion-panel-content>
        <div slot="header"><span class="filter-title">Location</span></div>
        <v-list dense>
          <v-list-tile v-for="region in regions" v-bind:key="region">
            <v-list-tile-action>
              <v-checkbox v-model="selectedRegions" :value="region" @change="updateFilter">
                <span class="filter-item" slot="label">{{region}}</span>
              </v-checkbox>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-expansion-panel-content>
      <v-expansion-panel-content>
        <div slot="header"><span class="filter-title">Type</span></div>
        <v-list dense>
          <v-list-tile v-for="type in types" v-bind:key="type.id">
            <v-list-tile-action>
              <v-checkbox v-model="selectedTypes" :value="type.id" @change="updateFilter">
                <span class="filter-item" slot="label">{{type.name}}</span>
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
import { TYPES } from '@/models/ItemFactory';
import ResourceGroup from '@/models/ResourceGroup';
import ResourceGroupFilter from '@/models/filters/ResourceGroupFilter';
import TypeFilter from '@/models/filters/TypeFilter';
import RegionFilter from '@/models/filters/RegionFilter';
import CloudFoundryOrganizationFilter from '@/models/filters/CloudFoundryOrganizationFilter';
import AndFilter from '@/models/filters/AndFilter';
import OrFilter from '@/models/filters/OrFilter';
import NotFilter from '@/models/filters/NotFilter';
import Item from '@/models/Item';

@Component
export default class Faceted extends Vue {
  private types = TYPES;
  private selectedGroups: ResourceGroup[] = [];
  private selectedTypes: string[] = [];
  private selectedRegions: string[] = [];
  private selectedOrgs: string[] = [];

  public updateFilter() {
    const groupFilters = this.selectedGroups.map((group) => new ResourceGroupFilter(group));
    const typesFilters = this.selectedTypes.map((type) => new TypeFilter(type));
    const regionsFilters = this.selectedRegions.map((region) => new RegionFilter(region));
    const organizationsFilters = this.selectedOrgs.map((organization) => new CloudFoundryOrganizationFilter(organization));
    const filter = new AndFilter([
      new OrFilter(groupFilters),
      new OrFilter(typesFilters),
      new OrFilter(regionsFilters),
      new OrFilter(organizationsFilters),
      new NotFilter(
        new OrFilter([
          new TypeFilter('cf-service-binding'),
          new TypeFilter('resource-alias'),
          new TypeFilter('resource-binding'),
          new TypeFilter('resource-group'),
        ]),
      ),
    ]);
    this.$store.dispatch('filter', filter);
  }

  get organizations() {
    return [...new Set(this.$store.state.resources
      .filter((item: Item) => item.type === 'cf-organization')
      .map((item: Item) => item.name))];
  }

  get regions() {
    return [...new Set(this.$store.state.resources.map((item: Item) => item.region))]
      .filter((region) => region != null && (region as string).length > 0);
  }

  get cssProps() {
    return {
      '--secondary-color': this.$vuetify.theme.secondary
    };
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

.filter-title {
  font-weight: bold;
}

.filter-item {
  overflow: hidden;
  font-size: 13px;
  color: var(--secondary-color);
  text-align: left;
}

</style>

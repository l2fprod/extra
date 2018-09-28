<template>
  <v-layout row fill-height>
    <div class="filters">
      <v-expansion-panel expand>
        <v-expansion-panel-content>
          <div slot="header"><span class="filter-title">Resource Group</span></div>
          <v-list dense>
            <v-list-tile v-for="group in $store.state.resourcesByType.get('resource-group')" v-bind:key="group.id">
              <v-list-tile-action>
                <v-checkbox v-model="selectedGroups" :value="group"></v-checkbox>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{group.name}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <div slot="header"><span class="filter-title">Cloud Foundry</span></div>
          <v-list dense>
            <v-list-tile v-for="organization in organizations" v-bind:key="organization">
              <v-list-tile-action>
                <v-checkbox v-model="selectedOrgs" :value="organization"></v-checkbox>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{organization}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <div slot="header"><span class="filter-title">Location</span></div>
          <v-list dense>
            <v-list-tile v-for="region in regions" v-bind:key="region">
              <v-list-tile-action>
                <v-checkbox v-model="selectedRegions" :value="region"></v-checkbox>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{region}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <div slot="header"><span class="filter-title">Type</span></div>
          <v-list dense>
            <v-list-tile v-for="type in types" v-bind:key="type.id">
              <v-list-tile-action>
                <v-checkbox v-model="selectedTypes" :value="type.id"></v-checkbox>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{type.name}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </div>
    <div class="resources elevation-1">
        <v-data-table
    :headers="[
      { text: 'Name', value: 'name' },
      { text: 'Family', value: 'family' },
      { text: 'Type', value: 'type' },
      { text: 'Region', value: 'region' },
      { text: 'Group', value: 'parent' },
      { text: 'Created At', value: 'creation_date' }
    ]"
    :items="filteredResources"
    hide-actions
    class="elevation-1 all-resources"
  >
    <template slot="items" slot-scope="props">
      <td>
        <a v-if="props.item.dashboard_url" :href="props.item.dashboard_url">{{ props.item.name }}</a>
        <span v-else>{{ props.item.name }}</span>
      </td>
      <td class="text-xs-right">{{ props.item.family }}</td>
      <td class="text-xs-right">{{ props.item.type }}</td>
      <td class="text-xs-right">{{ props.item.region }}</td>
      <td class="text-xs-right">{{ props.item.parent ? props.item.parent.name : '-' }}</td>
      <td class="text-xs-right">{{ props.item.creation_date }}</td>
    </template>
  </v-data-table>
    </div>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { TYPES } from '@/models/ItemFactory';
import CloudFoundryOrganizationFilter from '@/models/filters/CloudFoundryOrganizationFilter';
import ResourceGroup from '@/models/ResourceGroup';
import ResourceGroupFilter from '@/models/filters/ResourceGroupFilter';
import OrFilter from '@/models/filters/OrFilter';
import AndFilter from '@/models/filters/AndFilter';
import TypeFilter from '@/models/filters/TypeFilter';
import RegionFilter from '@/models/filters/RegionFilter';
import NotFilter from '@/models/filters/NotFilter';
import Item from '@/models/Item';

@Component({
  components: {},
})
export default class Canoe extends Vue {
  private types = TYPES;
  private selectedGroups: ResourceGroup[] = [];
  private selectedTypes: string[] = [];
  private selectedRegions: string[] = [];
  private selectedOrgs: string[] = [];

  get filteredResources() {
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
    return this.$store.state.filteredResources.filter((item: Item) => filter.accept(item));
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
}
</script>

<style lang="scss" scoped>
.filters {
  width: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.filter-title {
  font-weight: bold;
}

.resources {
  overflow-x: auto;
  overflow-y: auto;
  flex: 1;
  background-color: $table-background;
  margin-left: 20px;
}

</style>

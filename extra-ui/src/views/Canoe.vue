<template>
  <v-layout row fill-height :style="cssProps">
    <div class="resources-container">
      <v-data-table
        disable-pagination
        :headers="[
          { text: 'Name', value: 'name' },
          { text: 'Type', value: '__extendedType', },
          { text: 'Location', value: 'region', align: 'center', },
          { text: 'Group', value: '__pathToRoot', align: 'center', },
          { text: 'Status', value: '__status', align: 'center', },
          { text: 'Age', value: 'creation_date', align: 'right' },
          { text: 'Created By', value: 'created_by', align: 'right' }
        ]"
        :items="$store.state.filteredResources"
        hide-default-footer
        multi-sort
        class="elevation-1 resources"
        no-data-text="No data available. Use the Refresh button or extend your search."
      >
        <template slot="item" slot-scope="props">
          <tr @click="select(props.item)" :class="{ selected: selectedItem == props.item }">
            <td>
              <v-layout row align-center>
                <img class="resource-icon" v-if="props.item.__icon" :src="props.item.__icon" />
                <v-icon color="grey lighten-1" class="resource-icon" v-if="!props.item.__icon">widgets</v-icon>
                <a class="secondary--text" v-if="props.item.__dashboardUrl" :href="props.item.__dashboardUrl">
                  {{ props.item.name }}
                </a>
                <span class="secondary--text" v-else>
                  {{ props.item.name }}
                  </span>
              </v-layout>
            </td>
            <td class="text-ellipsis text-xs-right">
              {{ props.item.__extendedType }}
            </td>
            <td width="100" class="text-nowrap text-xs-right">
              {{ props.item.region }}
            </td>
            <td class="text-xs-left">
              <v-chip v-for="parent in props.item.parents()" v-bind:key="parent.resource_id"
                      label outlined small color="secondary"
              >{{ parent.name }}</v-chip>
            </td>
            <td width="100" class="text-xs-center">
              {{ props.item.__status }}
            </td>
            <td class="text-nowrap text-xs-right">
              <v-tooltip top>
                <template v-slot:activator="{ on }"><span>{{ relativeDate(props.item.creation_date) }}</span></template>
                <span>{{ humanDate(props.item.creation_date) }}</span>
              </v-tooltip>
            </td>
            <td class="text-ellipsis text-xs-right">
              <v-tooltip top>
                <template v-slot:activator="{ on }"><span>{{ props.item.doc.created_by }}</span></template>
                <span>{{ props.item.doc.created_by }}</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
    <div class="preview elevation-1" v-if="selectedItem != null">
      <v-toolbar flat dense>
        <img class="resource-icon" v-if="selectedItem.__icon" :src="selectedItem.__icon" />
        <v-icon color="grey lighten-1" class="resource-icon" v-if="!selectedItem.__icon">widgets</v-icon>
        <h2 class="title">{{selectedItem.name}}</h2>
        <v-spacer />
        <v-btn small icon @click="selectedItem = null">
          <v-icon>close</v-icon>
          </v-btn>
      </v-toolbar>
      <div>
        <v-chip v-for="parent in selectedItem.parents()" v-bind:key="parent.resource_id"
          label outlined small color="secondary"
        >{{ parent.name }}</v-chip>
      </div>
      <CloudFoundryApplicationPreview :item="selectedItem" v-if="selectedItem.type == 'cf-application'" />
    </div>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Item from '@/models/Item';
import CloudFoundryApplicationPreview from '@/components/CloudFoundryApplicationPreview.vue';

@Component({
  components: {
    CloudFoundryApplicationPreview,
  },
})
export default class Canoe extends Vue {

  public selectedItem: Item | null = null;

  public select(item: Item) {
    this.selectedItem = item;
  }

    get cssProps() {
    return {
      '--highlight-background-color': this.$vuetify.theme.themes.light.warning,
    };
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

.resources-container {
  margin-left: 12px;
  margin-right: 12px;
  margin-top: 0px;
  min-width: 200px;
  height: 100%;
  flex: 1;
}

.resources {
  height: 100%;
  overflow-x: auto;
  overflow-y: auto;
}

.preview {
  margin-left: 10px;
  margin-right: 20px;
  padding: 10px;
  width: 400px;
  background-color: $table-background;
}

.resource-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

tr.selected {
  background-color: var(--highlight-background-color);
}
</style>

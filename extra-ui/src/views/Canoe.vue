<template>
  <v-layout row fill-height :style="cssProps">
    <div class="resources-container">
      <v-data-table
        :headers="[
          { text: 'Name', value: 'name',  },
          { text: 'Type', value: 'type', width: '200' },
          { text: 'Region', value: 'region', width: '150', align: 'center' },
          { text: 'Group', value: 'pathToRoot', width: '400', align: 'center',  },
          { text: 'Age', value: 'creation_date', width: '150', align: 'right' }
        ]"
        :items="$store.state.filteredResources"
        hide-actions
        class="elevation-1 resources"
        no-data-text="No data available. Use the Refresh button or extend your search."
      >
        <template slot="items" slot-scope="props">
          <tr @click="select(props.item)" :class="{ selected: selectedItem == props.item }">
            <td class="text-nowrap">
              <a class="secondary--text" v-if="props.item.dashboard_url" :href="props.item.dashboard_url">{{ props.item.name }}</a>
              <span class="secondary--text" v-else>{{ props.item.name }}</span>
            </td>
            <td class="text-nowrap text-xs-right">{{ props.item.type }}</td>
            <td class="text-nowrap text-xs-right">{{ props.item.region }}</td>
            <td class="text-xs-left">
              <v-chip v-for="parent in props.item.parents()" v-bind:key="parent.resource_id"
                      disabled label outline small color="secondary"
              >{{ parent.name }}</v-chip>
            </td>
            <td class="text-nowrap text-xs-right">
              <v-tooltip top>
                <span slot="activator">{{ relativeDate(props.item.creation_date) }}</span>
                <span>{{ humanDate(props.item.creation_date) }}</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
    <div class="preview elevation-1" v-if="selectedItem != null">
      <v-toolbar flat dense>
        <h2 class="title">{{selectedItem.name}}</h2>
        <v-spacer />
        <v-btn small icon @click="selectedItem = null">
          <v-icon>close</v-icon>
          </v-btn>
      </v-toolbar>
      <div>
        <v-chip v-for="parent in selectedItem.parents()" v-bind:key="parent.resource_id"
          disabled label outline small color="secondary"
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
      '--highlight-background-color': this.$vuetify.theme.warning,
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
  margin-top: 0px;
  min-width: 200px;
  flex: 1;
}

.resources {
  max-height: 100%;
  overflow-x: auto;
  overflow-y: auto;
}

.preview {
  margin-left: 10px;
  padding: 10px;
  width: 400px;
}

tr.selected {
  background-color: var(--highlight-background-color);
}
</style>

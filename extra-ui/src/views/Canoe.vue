<template>
  <v-layout row fill-height>
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
    :items="$store.state.filteredResources"
    hide-actions
    class="elevation-1 all-resources"
        no-data-text="No data available. Use the Refresh button or extend your search."
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

@Component({
  components: {},
})
export default class Canoe extends Vue {
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

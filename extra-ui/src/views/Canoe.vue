<template>
  <v-layout row fill-height>
    <div class="resources elevation-1">
      <v-data-table
        :headers="[
          { text: 'Name', value: 'name',  },
          { text: 'Type', value: 'type', width: '200' },
          { text: 'Region', value: 'region', width: '150', align: 'center' },
          { text: 'Group', value: 'parent', width: '400', align: 'center',  },
          { text: 'Age', value: 'creation_date', width: '150', align: 'right' }
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
          <td class="text-xs-right">{{ props.item.type }}</td>
          <td class="text-xs-right">{{ props.item.region }}</td>
          <td class="text-xs-left">
            <v-chip v-for="parent in props.item.parents()" v-bind:key="parent.resource_id"
                    label outline small color="secondary"
            >{{ parent.name }}</v-chip>
          </td>
          <td class="text-xs-right">
            <v-tooltip top>
              <span slot="activator">{{ relativeDate(props.item.creation_date) }}</span>
              <span>{{ humanDate(props.item.creation_date) }}</span>
            </v-tooltip>
          </td>
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
  margin-top: 10px;
  overflow-x: auto;
  overflow-y: auto;
  flex: 1;
}

</style>

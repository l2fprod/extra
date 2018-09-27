<template>
  <v-layout row fill-height>
  <v-data-table
    :headers="[
      { text: 'Name', value: 'name' },
      { text: 'Family', value: 'family' },
      { text: 'Type', value: 'type' },
      { text: 'Region', value: 'region' },
      { text: 'Created At', value: 'creation_date' }
    ]"
    :items="$store.state.filteredResources"
    hide-actions
    class="elevation-1 all-resources"
  >
    <template slot="items" slot-scope="props">
      <td><a :href="props.item.url()">{{ props.item.name }}</a></td>
      <td class="text-xs-right">{{ props.item.family }}</td>
      <td class="text-xs-right">{{ props.item.type }}</td>
      <td class="text-xs-right">{{ props.item.region }}</td>
      <td class="text-xs-right">{{ props.item.creation_date }}</td>
    </template>
  </v-data-table>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class Home extends Vue {}
</script>

<style lang="scss" scoped>
.all-resources {
  overflow-x: auto;
  overflow-y: auto;
  flex: 1;
  background-color: $table-background;
}

tbody {
  overflow: scroll;
}
</style>
